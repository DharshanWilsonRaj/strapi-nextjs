import Image from "next/image";
import axios from "axios";
export default async function SingleBlogPost({ params }) {
    const host = process.env.STRAPI_HOST;
    const token = process.env.STRAPI_API_TOKEN;
    const { slug } = await params;
    let blog = [];
    let contentHtml = ''

    try {
        const response = await axios.get(`${host}/api/blogs?filters[slug][$eq]=${slug}&populate=*`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            blog = response.data.data?.[0];
            contentHtml = renderRichText(response.data.data?.[0].blog_content || []);
        } else {
            console.error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching blog post:', error.message);
    }

    function renderRichText(data) {
        return data?.length && data?.map(block => {
            switch (block.type) {
                case 'heading':
                    return `<h${block.level}>${block.children.map(child => child.text).join('')}</h${block.level}>`;
                case 'paragraph':
                    return `<p>${block.children.map(child => child.text).join('')}</p>`;
                default:
                    return '';
            }
        }).join('');
    }
    console.log(contentHtml);


    return (
        <div className='container py-2'>
            <h1 className='text-center'>STRAPI CMS WITH NEXT JS</h1>


            <div>
                <Image src={`${host}${blog.post.url}`} width={1300}
                    height={500}
                    alt="blog post" />
            </div>
            <h2>{blog?.title}</h2>
            <div className="py-2" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div >
    );
}

export const revalidate = 10; 