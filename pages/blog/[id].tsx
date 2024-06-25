import { GetStaticProps, GetStaticPaths } from 'next';
import { getPostData, getSortedPostsData } from '../../lib/blog';
import { format } from 'date-fns';

export default function BlogPost({ postData }: { postData: { title: string; date: string; contentHtml: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
      <div className="text-gray-500 mb-8">{format(new Date(postData.date), 'MMMM d, yyyy')}</div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getSortedPostsData().map((post) => ({
    params: { id: post.id },
  }));
  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string);
  return { props: { postData } };
}