import TopBar from '../components/TopBar.jsx'
import './Home.css'
import './News.css'
import Sidebar from '../components/Sidebar.jsx';
import React, { useState } from 'react'

function DeleteLink( { onDelete } ) {
  const [hidden, setHidden] = React.useState(false);

  if (hidden) return null;

  return (
    <a
      className="aDelete"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (onDelete) {
          onDelete();
        }
      }}
    >
      Delete
    </a>
  );
}

export default function News() {
    const user = { firstName: 'John', lastName: 'Doe', role: 'admin' };
    const handleLogout = () => alert('Logout... (to implement)');

    const [showArticle1, setShowArticle1] = useState(true);
    const [showArticle2, setShowArticle2] = useState(true);
    const [showArticle3, setShowArticle3] = useState(true);
    const [showArticle4, setShowArticle4] = useState(true);
    const [showArticle5, setShowArticle5] = useState(true);
    const [showArticle6, setShowArticle6] = useState(true);

    return (
        <div className="home-container">
            <TopBar />
            <div style={{display:'flex'}}>
                <Sidebar active="admin" user={user} onLogout={handleLogout} />
                <main id="News" className="home-main constrained" style={{ padding: '2rem' }}>
                    <h1>News</h1>
                    <div className="news-grid">

                        {showArticle1 && (
                        <article>
                            <img
                                src="https://imgs.search.brave.com/ZGW2uDpyFx5Jju9d0kIr_odMNtU66_WkIeXu9QmpWnA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvNlhHZUp3c1VQ/OWMvbWF4cmVzZGVm/YXVsdC5qcGc"
                                alt="Silksong"
                            />
                            <h2>Hollow Knight: Silksong</h2>
                            <div>
                                <p>Hollow Knight: Silksong has officially launched Thursday, September 4, 2025, concluding a seven-year development cycle and a six-year wait for fans.
                                    The game is now available on PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X|S, Nintendo Switch, and Nintendo Switch 2, with a price point of €19.99.
                                </p>
                                <div className='aButton'>
                                    <a className='aEdit' href="#">Edit</a>
                                    <a className='aReadMore' href="#">Read more</a>
                                    <DeleteLink onDelete={() => setShowArticle1(false)} />
                                </div>
                            </div>
                        </article> )}

                        {showArticle2 && (
                        <article>
                            <img
                                src="https://images.pexels.com/photos/7168798/pexels-photo-7168798.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="easter eggs"
                            />
                            <h2>Easter Eggs</h2>
                            <div>
                                <p>Easter eggs are a colorful symbol of new life and rebirth, often decorated and hidden for
                                    festive hunts. The tradition comes from ancient spring rituals and was later adopted
                                    into Easter celebrations to represent the resurrection.</p>
                                <div className='aButton'>
                                    <a className='aEdit' href="#">Edit</a>
                                    <a className='aReadMore' href="#">Read more</a>
                                    <DeleteLink onDelete={() => setShowArticle2(false)} />
                                </div>
                            </div>
                        </article> )}

                        {showArticle3 && (
                        <article>
                            <img
                                src="https://images.pexels.com/photos/4099179/pexels-photo-4099179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="hot cross buns"
                            />
                            <h2>Hot Cross Buns</h2>
                            <div>
                                <p>Hot cross buns are sweet, spiced buns marked with a cross on top, traditionally eaten on
                                    Good Friday. They originated in England and symbolize the crucifixion, with the cross
                                    representing Jesus and the spices recalling burial traditions.</p>
                                <div className='aButton'>
                                    <a className='aEdit' href="#">Edit</a>
                                    <a className='aReadMore' href="#">Read more</a>
                                    <DeleteLink onDelete={() => setShowArticle3(false)} />
                                </div>
                            </div>
                        </article> )}

                        {showArticle4 && (
                        <article>
                            <img
                                src="https://images.pexels.com/photos/5145/animal-easter-chick-chicken.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="easter chick"
                            />
                            <h2>Easter Chick</h2>
                            <div>
                                <p>Easter chicks are a cheerful symbol of new life and beginnings, often seen alongside eggs
                                    in spring decorations. They represent birth and renewal, tying into the themes of Easter
                                    and the arrival of spring.</p>
                                <div className='aButton'>
                                    <a className='aEdit' href="#">Edit</a>
                                    <a className='aReadMore' href="#">Read more</a>
                                    <DeleteLink onDelete={() => setShowArticle4(false)} />
                                </div>
                            </div>
                        </article> )}

                        {showArticle5 && (
                        <article>
                            <img
                                src="https://images.pexels.com/photos/2072158/pexels-photo-2072158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="easter bunny"
                            />
                            <h2>Easter Bunnies</h2>
                            <div>
                                <p>Easter bunnies are a popular symbol of spring and new life, often seen delivering
                                    colorful eggs to children.</p>
                                <div className='aButton'>
                                    <a className='aEdit' href="#">Edit</a>
                                    <a className='aReadMore' href="#">Read more</a>
                                    <DeleteLink onDelete={() => setShowArticle5(false)} />
                                </div>
                            </div>
                        </article> )}

                        {showArticle6 && (
                        <article>
                            <img
                                src="https://images.pexels.com/photos/12787666/pexels-photo-12787666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="crown of thorns"
                            />
                            <h2>Crown of Thorns</h2>
                            <div>
                                <p>The Crown of Thorns symbolizes the suffering of Jesus before his crucifixion. It
                                    represents the pain he endured for humanity’s salvation and is a reminder of his
                                    sacrifice during Easter.</p>
                                <div className='aButton'>
                                    <a className='aEdit' href="#">Edit</a>
                                    <a className='aReadMore' href="#">Read more</a>
                                    <DeleteLink onDelete={() => setShowArticle6(false)} />
                                </div>
                            </div>
                        </article> )}

                    </div>
                </main>
            </div>
        </div>
    )    
}    
