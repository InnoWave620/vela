import { NextFunction, Request, Response } from 'express';
import { db } from '../../../infrastructure/database/pool';
import { sendSuccess } from '../utils/apiResponse';

export class TwinController {
  public getBirthdayTwins = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dob = (req.query.dob as string) || '1998-10-27';
      const category = (req.query.category as string) || 'all';
      const parts = dob.split('-');
      const month = parseInt(parts[1], 10) || 10;
      const day = parseInt(parts[2], 10) || 27;

      let whereClause = 'WHERE birth_month = $1 AND birth_day = $2';
      const params: any[] = [month, day];

      if (category && category !== 'all') {
        params.push(category);
        whereClause += ` AND age_category = $${params.length}`;
      }

      const query = `
        SELECT 
          id, 
          name, 
          avatar_url AS avatar, 
          bio, 
          location, 
          occupation, 
          membership_tier,
          age_category AS "ageCategory",
          is_parent_managed AS "isParentManaged",
          parent_guardian_name AS "parentGuardianName",
          date_of_birth AS "birthDate", 
          zodiac_sign AS "zodiacSign",
          DATE_PART('year', AGE(NOW(), date_of_birth))::int AS age,
          95 AS "matchScore",
          ARRAY['Shared Birthday', 'Celebrations', 'Memory Milestones'] AS "mutualInterests",
          false AS "isInvited"
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT 30;
      `;

      const result = await db.query(query, params);
      sendSuccess(res, result.rows);
    } catch (err) {
      next(err);
    }
  };

  public inviteTwin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { twinId } = req.params;
      try {
        await db.query(
          `INSERT INTO twin_invitations (id, sender_id, receiver_id, status)
           VALUES ($1, $2, $3, 'sent')
           ON CONFLICT (id) DO NOTHING`,
          [`inv_${Date.now()}`, 'usr_senzo_001', twinId]
        );
      } catch {
        // Table or user might not exist yet
      }

      sendSuccess(res, { success: true, message: 'Celebration invitation dispatched.' });
    } catch (err) {
      next(err);
    }
  };
}
