import axios from 'axios';
import Image from 'next/image';

export default async function Home() {
  const host = process.env.STRAPI_HOST;
  const token = process.env.STRAPI_API_TOKEN;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  let blogs = [];

  try {
    const response = await axios.get(`${host}/api/blogs?populate=*`, config);
    blogs = response.data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div className="container py-4">
      <h2 className="text-center">STRAPI CMS WITH NEXT JS</h2>

      {blogs && blogs.length > 0 ? (
        <div>
          {blogs.map((blog) => (
            <div key={blog.id} className="card" style={{ width: '18rem', marginBottom: '10px' }}>
              <Image
                src={`${host}${blog.post.url}`}
                alt={blog.title}
                width={150}
                height={150}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <a href={`/blogs/${blog.slug}`} className="btn btn-primary">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
}

// Add revalidate option for Incremental Static Regeneration (ISR)
export const revalidate = 10; // This will re-fetch the page every 10 seconds
