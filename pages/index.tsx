import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { CalendarOutline, HomeOutline, RssOutline, TagOutline, UserCircleOutline } from 'heroicons-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { formatSlug } from '../utils/slugFormat'

const NOTION_BLOG_ID = process.env.NOTION_BLOG_ID || '7021cba3b8a04865850473d4037762ad'

export interface Author {
  id: string
  firstName: string
  lastName: string
  fullName: string
  profilePhoto: string
}

export interface Post {
  id: string
  name: string
  tag: string
  published: boolean
  date: string
  slug: string
  author: Author[]
  preview: string
}

export const getAllPosts = async (): Promise<Post[]> => {
  return await fetch(`https://notion-api.splitbee.io/v1/table/${NOTION_BLOG_ID}`).then(res => res.json())
}

export const getStaticProps = async () => {
  const posts = (await getAllPosts()).filter(p => p.published)
  return {
    props: {
      posts
    },
    revalidate: 1
  }
}

const HomePage = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      <Head>
        <title>Spencer&apos;s Blog</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="container mx-auto px-6 justify-center flex-grow max-w-3xl">
          <Navbar />

          <div className="my-16">
            <div className="inline-block shadow-lg rounded-full w-18 h-18">
              <Image className="rounded-full" src="/images/avatar.png" alt="avatar" width="100%" height="100%" />
            </div>
            <div className="mt-8 text-2xl font-bold">Spencer&apos;s Blog</div>

            <div className="mt-12 leading-loose flex flex-col space-y-4">
              {posts.map(
                post =>
                  post.published && (
                    <Link key={post.id} href="/[year]/[month]/[slug]" as={formatSlug(post.date, post.slug)}>
                      <a className="p-4 sm:p-6 border-2 border-gray-100 bg-white rounded hover:bg-gray-50">
                        <div className="rounded mb-2 px-2 py-1 text-blue-800 bg-blue-100 text-sm inline-block">
                          <div className="flex items-center space-x-1">
                            <TagOutline size={16} /> <span>{post.tag}</span>
                          </div>
                        </div>
                        <div className="font-bold text-xl mb-1">{post.name}</div>
                        <div className="text-sm text-gray-400 mb-2">{post.preview}</div>
                        <div className="text-sm text-gray-400 flex flex-nowrap items-center space-x-2 overflow-hidden">
                          <CalendarOutline size={16} className="flex-shrink-0" />
                          <span className="flex-shrink-0">{new Date(post.date).toLocaleDateString()}</span>
                          {post.author.map(author => (
                            <div key={author.id} className="flex items-center space-x-1 flex-shrink-0">
                              <img src={author.profilePhoto} alt="profile photo" className="w-6 h-6 rounded-full" />
                              <span className="hidden md:block">{author.fullName}</span>
                            </div>
                          ))}
                        </div>
                      </a>
                    </Link>
                  )
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default HomePage
