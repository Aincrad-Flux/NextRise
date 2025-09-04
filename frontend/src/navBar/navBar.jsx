import { useState } from 'react'
import './navBar.css'

function NavBar(){

  const isStartup = false;
  const isAdmin = false;
  const isLoggedIn = false

  return (
    <div>
      <button className='list-icon'>
        <img src="../assets/react.svg" alt=''/>
      </button>
      <button className='arrow-left-icon'>
        <img src="../assets/arrow-left.svg" alt=''/>
      </button>
      <nav className='menu'>
        <ul>
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
    </div>
  )
}

export default NavBar
