import { useState } from 'react'
import './navBar.css'

function NavBar(){

  const [menuBar, setMenu] = useState(true)
  const isStartup = false;
  const isAdmin = false;
  const isLoggedIn = false

  return (
    <nav className='menu'>
      <ul className={`${menuBar ? 'flex' : 'hidden'} 'w-full flex-col items-center justify-center bg-slate-900 absolute top-full pb-5 sm:flex sm:relative sm:flex-row sm:pb-0'`}>
        <li>
          <a className='menuLink' href="#">Home</a>
        </li>
        <li>
          <a className='menuLink' href="#">Project catalog</a>
        </li>
        <li>
          <a className='menuLink' href="#">News</a>
        </li>
        <li>
          <a className='menuLink' href="#">Events</a>
        </li>
        {isStartup && <li><a className='menuLink' href="#">Startup</a></li>}
        {isAdmin && <li><a className='menuLink' href="#">Admin</a></li>}
        {
          isLoggedIn ?
          (<li><a className='menuLink' href="#">Profil</a></li>)
          :
          (<li><a className='menuLink' href="#">Log in</a></li>)
        }
      </ul>
    </nav>
  )
}

export default NavBar
