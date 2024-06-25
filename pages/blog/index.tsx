import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getSortedPostsData } from '../../lib/blog';
import { format } from 'date-fns';

export default function BlogIndex({ allPostsData }: { allPostsData: { date: string; title: string; id: string }[] }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-4">
        {allPostsData.map(({ id, date, title }) => (
          <li key={id} className="border-b pb-4">
            <Link href={`/blog/${id}`} className="text-xl font-semibold text-blue-600 hover:text-blue-800">
              {title}
            </Link>
            <br />
            <small className="text-gray-500">{format(new Date(date), 'MMMM d, yyyy')}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData();
    console.log('All posts data:', allPostsData);
    return {
      props: {
        allPostsData,
      },
    };
  }