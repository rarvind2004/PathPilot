import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    const [trips] = await pool.query(
      `SELECT t.trip_id, t.title, t.country_name,
         (SELECT COUNT(*) FROM day d WHERE d.trip_id = t.trip_id) AS day_count,
         (SELECT COUNT(*) FROM itinerary_item ii WHERE ii.trip_id = t.trip_id) AS activity_count
       FROM trip t
       JOIN creates c ON t.trip_id = c.trip_id
       WHERE c.email = ?
       ORDER BY t.trip_id DESC`,
      [email]
    );
    
    return Response.json({ trips });
  } catch (error) {
    console.error('List trips error:', error);
    return Response.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}