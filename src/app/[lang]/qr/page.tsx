
import Image from 'next/image';
import { AtSign, Instagram, Link as LinkIcon, Phone } from 'lucide-react';

const QRPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-8">
          <Image
            src="/logo-full.svg"
            alt="Pilot Trax Logo"
            width={240}
            height={80}
            className="mx-auto"
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <LinkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <a
              href="https://pilottrax.net"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-4 text-lg font-medium text-gray-800 dark:text-gray-200"
            >
              pilottrax.net
            </a>
          </div>
          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Instagram className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <a
              href="https://instagram.com/pilottrax"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-4 text-lg font-medium text-gray-800 dark:text-gray-200"
            >
              pilottrax
            </a>
          </div>
          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Phone className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <a
              href="https://wa.me/989377710010"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-4 text-lg font-medium text-gray-800 dark:text-gray-200"
              dir="ltr"
            >
              +98 937 771 0010
            </a>
          </div>
          <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <AtSign className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <a
              href="mailto:pilottrax@gmail.com"
              className="mx-4 text-lg font-medium text-gray-800 dark:text-gray-200"
            >
              pilottrax@gmail.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QRPage;
