import Link from 'next/link'

export const Footer = () => {
    return <footer className="bg-white py-4 flex flex-col items-center text-center">
        { /* desktop */ }
        <div className="max-lg:hidden flex flex-row items-center w-full px-20">
          <Link href="https://www.upf.edu/"><img src="/UPFLogo.png" alt="GitHub Logo" width="100px" /></Link>
          <div className="flex-1" />
            <p className="text-gray-500 text-xs">
            This is an Open Source project performed by a group of students from UPF.
              All collected data will be used for academic purposes only.  
            </p>
            <div className="flex-1" />
            <a href="https://github.com/miquelvir/CIPI" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500 text-gray-500 text-xs">GitHub</a>
        </div>

        { /* mobile */ }
        <div className="lg:hidden flex flex-col items-center w-full px-20">
          <Link href="https://www.upf.edu/"><img src="/UPFLogo.png" alt="GitHub Logo" width="100px" /></Link>
          <div className="flex-1 py-2" />
            <p className="text-gray-500 text-xs">
            This is an Open Source project performed by a group of students from UPF.
              All collected data will be used for academic purposes only.  
            </p>
            <div className="flex-1" />
            <a href="https://github.com/miquelvir/CIPI" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500 text-gray-500 text-xs py-2">GitHub</a>
        </div>
    </footer>  
}