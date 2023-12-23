import './App.css';
import { useState } from 'react';
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
  // const [marsPhotos, setMarsPhotos] = useState([]);
  // const [nasaImages, setNasaImages] = useState([]);

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
        // No need to send date in the body anymore
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

  // const fetchMarsRoverPhotos = async (sol, camera) => {
  //   const response = await fetch('http://localhost:3000/fetchMarsRoverPhotos', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ sol, camera }),
  //   });
  //   const data = await response.json();
  //   setMarsPhotos(data);
  // };

  // const fetchNasaImages = async (query) => {
  //   const response = await fetch('http://localhost:3000/fetchNasaImages', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ query }),
  //   });
  //   const data = await response.json();
  //   setNasaImages(data);
  // };

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
      <div className='mb-5'>
        <h1 className="title text-5xl md:text-7xl sm:text-3xl font-semibold mb-5 text-center">
          Astronomy Explorer
        </h1>
        <h2 className="title text-3xl md:text-5xl sm:text-2xl font-semibold mb-10 text-center">
          Discover the Cosmos
        </h2>

        {!showResults ? (
          <>
            {/* <div className='text-[#a2a7c0] p-2 text-xl text-center'>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('Enter the name of a star, planet, or moon.')
                  .start();
              }}
            />
          </div>

          <div className="glass-panel p-3 mb-10 rounded-lg text-center md:items-center">
            <h3 className="text-3xl text-[#d3d4db] mb-4 font-semibold md:mb-0">
              Search the Stars
            </h3>
            <input
              type="text"
              className='p-[9px] rounded-lg'
              value={celestialBody}
              onChange={e => setCelestialBody(e.target.value)}
              placeholder="Enter a celestial body (e.g., Earth, Moon)"
            /> */}
            <div className='text-[#a2a7c0] text-xl text-center'>
              <div className="glass-panel rounded-lg text-center md:items-center">
                <button className="btn text-white p-2 rounded-lg" onClick={handleFetchApod}>
                  Today's Picture of the Day
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-panel-container">
            <div className="glass-panel">
              <div className="image-container">
                {apodResult && <img src={apodResult.url} alt="APOD" className="apod-image" />}
              </div>
              <div className="info-container">
                {apodResult && <p>{apodResult.explanation}</p>}
              </div>
            </div>
            {/* {marsPhotos.map(photo => (
              <img key={photo.id} src={photo.img_src} alt="Mars Rover" />
            ))}
            {nasaImages.map(image => (
              <img key={image.nasa_id} src={image.links[0].href} alt={image.title} />
            ))}
          </animated.div>
          <div className="controls-container items-center flex justify-center mt-6">
            <button className="backbtn bg-[#26316b] text-2xl md:text-xl sm:text-lg text-white py-3 px-24 rounded-xl" onClick={() => setShowResults(false)}>Back</button>
          </div> */}
          </div>
        )}
      </div>
      <button id="logoutButton" onClick={logout} className="logout-button">Sign Out</button>
      <ToastContainer className="text-white" position="bottom-right" autoClose={5000} hideProgressBar closeOnClick />
    </section >
  );
}

export default App;
