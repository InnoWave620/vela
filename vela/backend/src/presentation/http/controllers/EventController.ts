import { NextFunction, Request, Response } from 'express';
import { db } from '../../../infrastructure/database/pool';
import { sendSuccess } from '../utils/apiResponse';

export class EventController {
  public getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = (req.query.category as string) || 'all';

      let whereClause = 'WHERE 1=1';
      const params: any[] = [];

      if (category && category !== 'all') {
        params.push(category);
        whereClause += ` AND (e.age_category = $${params.length} OR e.age_category = 'all')`;
      }

      const query = `
        SELECT 
          e.id,
          e.title,
          u.name AS "hostName",
          e.celebration_date AS "celebrationDate",
          e.event_time AS time,
          e.venue,
          e.city,
          e.dress_code AS "dressCode",
          e.age_category AS "ageCategory",
          e.description,
          e.cover_image AS "coverImage",
          e.max_attendees AS "maxAttendees",
          e.is_vela_sponsored AS "isVelaSponsored",
          e.sponsor_grant_details AS "sponsorGrantDetails",
          CASE 
            WHEN e.headline_artist_name IS NOT NULL THEN
              json_build_object(
                'id', e.headline_artist_id,
                'name', e.headline_artist_name,
                'genre', e.headline_artist_genre,
                'avatar', e.headline_artist_avatar,
                'setTime', e.headline_artist_set_time,
                'isVelaSponsored', e.is_vela_sponsored,
                'sponsorGrantDetails', e.sponsor_grant_details,
                'bookingStatus', e.artist_booking_status,
                'bookingFee', e.artist_booking_fee,
                'crowdfundedAmount', e.artist_crowdfunded_amount
              )
            ELSE NULL
          END AS "headlineArtist",
          COALESCE(
            json_agg(
              json_build_object(
                'id', a_user.id,
                'name', a_user.name,
                'avatar', a_user.avatar_url,
                'exactMatch', true
              )
            ) FILTER (WHERE a_user.id IS NOT NULL),
            '[]'::json
          ) AS attendees,
          BOOL_OR(ea.user_id = 'usr_senzo_001') AS "isJoined"
        FROM events e
        LEFT JOIN users u ON u.id = e.host_id
        LEFT JOIN event_attendees ea ON ea.event_id = e.id
        LEFT JOIN users a_user ON a_user.id = ea.user_id
        ${whereClause}
        GROUP BY 
          e.id, u.name, e.title, e.celebration_date, e.event_time, e.venue,
          e.city, e.dress_code, e.age_category, e.description, e.cover_image,
          e.max_attendees, e.is_vela_sponsored, e.sponsor_grant_details,
          e.headline_artist_id, e.headline_artist_name, e.headline_artist_genre,
          e.headline_artist_avatar, e.headline_artist_set_time,
          e.artist_booking_status, e.artist_booking_fee, e.artist_crowdfunded_amount,
          e.created_at
        ORDER BY e.created_at ASC;
      `;

      const result = await db.query(query, params);
      sendSuccess(res, result.rows);
    } catch (err) {
      next(err);
    }
  };

  public getArtists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const genre = req.query.genre as string;
      let query = `
        SELECT 
          id,
          name,
          stage_title AS "stageTitle",
          genre,
          bio,
          avatar_url AS avatar,
          cover_image_url AS "coverImage",
          booking_tier AS "bookingTier",
          booking_fee_estimate AS "bookingFeeEstimate",
          is_vela_partner AS "isVelaPartner",
          rating,
          sample_track_title AS "sampleTrackTitle",
          performance_duration AS "performanceDuration",
          location
        FROM celebrity_artists
      `;
      const params: any[] = [];
      if (genre && genre !== 'all') {
        params.push(`%${genre}%`);
        query += ` WHERE genre ILIKE $1`;
      }
      query += ` ORDER BY rating DESC, name ASC;`;

      const result = await db.query(query, params);
      sendSuccess(res, result.rows);
    } catch (err) {
      next(err);
    }
  };

  public bookArtistForEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params; // event_id
      const { artistId, isVelaSponsored, notes, customSetTime } = req.body;
      const userId = 'usr_senzo_001';

      // 1. Fetch artist details
      const artistRes = await db.query('SELECT * FROM celebrity_artists WHERE id = $1', [artistId]);
      if (artistRes.rows.length === 0) {
        res.status(404).json({ success: false, message: 'Artist not found in roster.' });
        return;
      }
      const artist = artistRes.rows[0];

      const status = isVelaSponsored ? 'vela_sponsored' : 'confirmed';
      const grantDetails = isVelaSponsored
        ? 'VIP guest headliner appearance sponsored by the Vela Executive Concierge.'
        : `Booked by event attendees & birthday twins. Booking fee: ${artist.booking_fee_estimate}`;
      const setTime = customSetTime || '22:00 Headline Celebration Performance';

      // 2. Update event record
      await db.query(
        `UPDATE events SET
          headline_artist_id = $1,
          headline_artist_name = $2,
          headline_artist_genre = $3,
          headline_artist_avatar = $4,
          headline_artist_set_time = $5,
          is_vela_sponsored = $6,
          sponsor_grant_details = $7,
          artist_booking_status = $8,
          artist_booking_fee = $9,
          artist_crowdfunded_amount = 50000
        WHERE id = $10`,
        [
          artist.id,
          artist.name,
          artist.genre,
          artist.avatar_url,
          setTime,
          Boolean(isVelaSponsored),
          grantDetails,
          status,
          artist.booking_fee_estimate,
          id,
        ]
      );

      // 3. Record booking entry
      const bookingId = `eab_${Date.now()}`;
      await db.query(
        `INSERT INTO event_artist_bookings (
          id, event_id, artist_id, requested_by_user_id, is_vela_sponsored, sponsorship_status, booking_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          bookingId,
          id,
          artist.id,
          userId,
          Boolean(isVelaSponsored),
          isVelaSponsored ? 'approved' : 'confirmed',
          notes || 'Celebration booking confirmed via Vela Talent Desk',
        ]
      );

      sendSuccess(res, {
        message: isVelaSponsored
          ? 'VELA Society Artist Sponsorship Grant Approved!'
          : 'Artist booking confirmed for your birthday celebration!',
        headlineArtist: {
          id: artist.id,
          name: artist.name,
          genre: artist.genre,
          avatar: artist.avatar_url,
          setTime,
          isVelaSponsored: Boolean(isVelaSponsored),
          sponsorGrantDetails: grantDetails,
          bookingStatus: status,
          bookingFee: artist.booking_fee_estimate,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  public joinEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = 'usr_senzo_001';

      const check = await db.query(
        'SELECT 1 FROM event_attendees WHERE event_id = $1 AND user_id = $2',
        [id, userId]
      );

      if (check.rows.length > 0) {
        await db.query('DELETE FROM event_attendees WHERE event_id = $1 AND user_id = $2', [id, userId]);
        sendSuccess(res, { isJoined: false });
      } else {
        await db.query(
          'INSERT INTO event_attendees (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [id, userId]
        );
        sendSuccess(res, { isJoined: true });
      }
    } catch (err) {
      next(err);
    }
  };
}
