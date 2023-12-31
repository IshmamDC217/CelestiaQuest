import './App.css';
import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TIMEOUT = 120000;

const fetchTimeout = (url, options, timeout = TIMEOUT) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
  ]);
};

function App() {
  const [celestialBody, setCelestialBody] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [apodResult, setApodResult] = useState(null);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [nasaImages, setNasaImages] = useState([]);

  useEffect(() => {
    handleFetchApod();
    fetchMarsRoverPhotos();
  }, []);

  const tableFade = useSpring({
    opacity: showResults ? 1 : 0,
    transform: showResults ? 'scale(1)' : 'scale(0.95)',
    config: {
      tension: 280,
      friction: 60,
    },
  });

  const rowVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleFetchApod = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/fetchAPOD', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setApodResult(data);
      setShowResults(true);
    } catch (error) {
      toast.error('Error fetching today\'s picture.');
      console.error('There was an error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarsRoverPhotos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/fetchMarsRoverPhotos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setMarsPhotos(data);
      setShowResults(true);
    } catch (error) {
      toast.error('Error fetching Mars Rover photos.');
      console.error('There was an error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNasaImages = async (query) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/fetchNasaImages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'stars' }),
      });
      const data = await response.json();

      console.log('NASA Images data:', data);

      setNasaImages(data.items);

      setShowResults(true);
    } catch (error) {
      toast.error('Error fetching NASA images.');
      console.error('There was an error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      window.location.href = '/login';
    } else {
      toast.error('Logout failed.');
    }
  };

  return (
    <section className='landingpage'>
      <video autoPlay loop muted className="video-background">
        <source src="/matrixbg.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="w-full min-h-screen text-slate-300 relative py-4">
        <div className="grid grid-cols-12 mx-auto gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 max-w-[1800px] my-10 px-2">
          <div id="menu" className="bg-white/10 col-span-3 rounded-lg p-4 ">
            <h1 className="font-bold text-lg lg:text-3xl bg-gradient-to-br from-white via-white/50 to-transparent bg-clip-text text-transparent">CelestiaQuest<span className="text-indigo-400">.</span></h1>
            <p className="text-slate-400 text-sm mb-2">Welcome back,</p>
            <a href="#" className="flex flex-col space-y-2 md:space-y-0 md:flex-row mb-5 items-center md:space-x-2 hover:bg-white/10 group transition duration-150 ease-linear rounded-lg group w-full py-3 px-2">
              <div>
                <p className="font-medium group-hover:text-indigo-400 leading-4">Ishmam Ahmed</p>
                <span className="text-xs text-slate-400">Software Engineer</span>
              </div>
            </a>
            <div className="my-2 border-slate-700">
              <div id="menu" className="flex flex-col space-y-2 my-5">
                <a href="#" className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 group-hover:text-indigo-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">Dashboard</p>
                      <p className="text-slate-400 text-sm hidden md:block">Data overview</p>
                    </div>

                  </div>
                </a>
                <a href="#" className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
                  <div className="relative flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 group-hover:text-indigo-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">Astrology</p>
                      <p className="text-slate-400 text-sm hidden md:block">Live Horoscope </p>
                    </div>
                    <div className="absolute -top-3 -right-3 md:top-0 md:right-0 px-2 py-1.5 rounded-full bg-indigo-800 text-xs font-mono font-bold">23</div>
                  </div>
                </a>
                <a href="#" className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 group-hover:text-indigo-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">Users</p>
                      <p className="text-slate-400 text-sm hidden md:block">Manage users</p>
                    </div>

                  </div>
                </a>
                <a href="#" className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 group-hover:text-indigo-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>

                    </div>
                    <div>
                      <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">Settings</p>
                      <p className="text-slate-400 text-sm hidden md:block">Edit settings</p>
                    </div>
                  </div>
                </a>
                <a href="#" className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group" onClick={logout}>
                  <div className="relative flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 group-hover:text-indigo-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">Sign Out</p>
                      <p className="text-slate-400 text-sm hidden md:block">Sign Out of CelestiaQuest</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div id="content" className="bg-white/10 col-span-9 rounded-lg p-6">
            <div>
              <h1 className="font-bold py-4 uppercase">Picture of the Day</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div className="bg-black/60 to-white/5 p-6 rounded-lg relative">
                  {apodResult ? (
                    apodResult.media_type === 'image' ? (
                      <img
                        src={apodResult.url}
                        alt="APOD"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      apodResult.media_type === 'video' ? (
                        <iframe
                          src={apodResult.url}
                          title="APOD Video"
                          style={{ width: '100%', height: '100%' }}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : null
                    )
                  ) : (
                    <span>Loading...</span>
                  )}
                </div>

                <div className="bg-black/60 p-6 rounded-lg">
                  <div className="flex flex-row items-center">
                    <div id="stats-1">
                    </div>
                    <div>
                      {apodResult ? (
                        <>
                          <p className="text-indigo-300 text-sm font-medium uppercase leading-4">
                            APOD
                          </p>
                          <p className="text-white font-bold text-xl">
                            {apodResult.title}
                          </p>
                          <p className="text-white font-bold text-md">
                            {apodResult.explanation}
                          </p>
                        </>
                      ) : (
                        <span>Loading...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="font-bold py-4 uppercase">Mars Rover Images - LIVE</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marsPhotos.length > 0 ? (
                  marsPhotos.map((photo, index) => (
                    <div key={index} className="bg-black/60 to-white/5 p-6 rounded-lg relative">
                      <img
                        src={photo.img_src}
                        alt={`Mars Rover Photo ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section >
  );
}

export default App;
