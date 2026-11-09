import { Request, Response, NextFunction } from 'express';
import { db } from '../../../infrastructure/database/pool';
import { sendSuccess } from '../utils/apiResponse';

export class FeedController {
  public getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = (req.query.category as string) || 'all';
      const visibility = req.query.visibility as string | undefined;

      let whereClause = 'WHERE 1=1';
      const params: any[] = [];

      if (category && category !== 'all') {
        params.push(category);
        whereClause += ` AND (p.age_category = $${params.length} OR p.age_category = 'all')`;
      }

      if (visibility && visibility !== 'all') {
        params.push(visibility);
        whereClause += ` AND p.visibility = $${params.length}`;
      }

      // Avoid Cartesian products by aggregating likes and comments in correlated subqueries
      const query = `
        SELECT 
          p.id,
          p.author_id AS "authorId",
          u.name AS "authorName",
          u.avatar_url AS "authorAvatar",
          u.age_category AS "authorCategory",
          u.is_parent_managed AS "isParentManaged",
          u.parent_guardian_name AS "parentGuardianName",
          CONCAT(TO_CHAR(u.date_of_birth, 'Mon DD'), ' Twin') AS "authorBirthdayBadge",
          p.content,
          p.media_type AS "mediaType",
          p.media_url AS "mediaUrl",
          p.thumbnail_url AS "thumbnailUrl",
          p.video_duration_seconds AS "videoDurationSeconds",
          p.age_category AS "ageCategory",
          p.visibility,
          p.music_title AS "musicTitle",
          p.music_artist AS "musicArtist",
          p.music_url AS "musicUrl",
          p.music_album_cover AS "musicAlbumCover",
          COALESCE(p.filter_applied, 'normal') AS "filterApplied",
          p.overlay_text AS "overlayText",
          p.overlay_emoji AS "overlayEmoji",
          COALESCE(p.likes_count, 0) + (
            SELECT COUNT(*)::int FROM post_likes l WHERE l.post_id = p.id
          ) AS "likesCount",
          COALESCE(p.comments_count, 0) + (
            SELECT COUNT(*)::int FROM post_comments c WHERE c.post_id = p.id
          ) AS "commentsCount",
          EXISTS(
            SELECT 1 FROM post_likes l WHERE l.post_id = p.id AND l.user_id = 'usr_senzo_001'
          ) AS "isLiked",
          TO_CHAR(p.created_at, 'HH24:MI') AS "createdAt",
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', c.id,
                  'authorName', cu.name,
                  'authorAvatar', cu.avatar_url,
                  'content', c.content,
                  'createdAt', TO_CHAR(c.created_at, 'HH24:MI')
                ) ORDER BY c.created_at ASC
              )
              FROM post_comments c
              JOIN users cu ON cu.id = c.author_id
              WHERE c.post_id = p.id
            ),
            '[]'::json
          ) AS comments
        FROM posts p
        JOIN users u ON u.id = p.author_id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT 50;
      `;

      const result = await db.query(query, params);
      sendSuccess(res, result.rows);
    } catch (err) {
      next(err);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        authorId = 'usr_senzo_001',
        content,
        mediaType = 'image',
        mediaUrl,
        thumbnailUrl,
        videoDurationSeconds = 0,
        ageCategory = 'all',
        visibility = 'public_world',
        musicTitle,
        musicArtist,
        musicUrl,
        musicAlbumCover,
        filterApplied = 'normal',
        overlayText,
        overlayEmoji,
      } = req.body;

      const postId = `post_${Date.now()}`;

      await db.query(
        `INSERT INTO posts (
          id, author_id, content, media_type, media_url, thumbnail_url,
          video_duration_seconds, age_category, visibility,
          music_title, music_artist, music_url, music_album_cover,
          filter_applied, overlay_text, overlay_emoji,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())`,
        [
          postId,
          authorId,
          content,
          mediaType,
          mediaUrl || null,
          thumbnailUrl || null,
          videoDurationSeconds || 0,
          ageCategory,
          visibility,
          musicTitle || null,
          musicArtist || null,
          musicUrl || null,
          musicAlbumCover || null,
          filterApplied || 'normal',
          overlayText || null,
          overlayEmoji || null,
        ]
      );

      const userRes = await db.query(
        'SELECT name, avatar_url, age_category, is_parent_managed, parent_guardian_name FROM users WHERE id = $1',
        [authorId]
      );
      const author = userRes.rows[0] || {
        name: 'Vela Member',
        avatar_url: '',
        age_category: 'adult',
        is_parent_managed: false,
        parent_guardian_name: null,
      };

      sendSuccess(
        res,
        {
          id: postId,
          authorId,
          authorName: author.name,
          authorAvatar: author.avatar_url,
          authorCategory: author.age_category,
          isParentManaged: author.is_parent_managed,
          parentGuardianName: author.parent_guardian_name,
          authorBirthdayBadge: 'Birthday Twin',
          content,
          mediaType,
          mediaUrl,
          thumbnailUrl,
          videoDurationSeconds,
          ageCategory,
          visibility,
          musicTitle,
          musicArtist,
          musicUrl,
          musicAlbumCover,
          filterApplied,
          overlayText,
          overlayEmoji,
          likesCount: 0,
          commentsCount: 0,
          isLiked: false,
          createdAt: 'Just now',
          comments: [],
        },
        201
      );
    } catch (err) {
      next(err);
    }
  };

  public toggleLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = 'usr_senzo_001';

      const check = await db.query(
        'SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2',
        [id, userId]
      );

      if (check.rows.length > 0) {
        await db.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [id, userId]);
        sendSuccess(res, { liked: false });
      } else {
        await db.query(
          'INSERT INTO post_likes (post_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
          [id, userId]
        );
        sendSuccess(res, { liked: true });
      }
    } catch (err) {
      next(err);
    }
  };
}
