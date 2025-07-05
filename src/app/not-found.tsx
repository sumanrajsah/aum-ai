import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='not-found-body'>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/"><button className='not-found-btn'>Return to home</button></Link>
        </div>
    )
}