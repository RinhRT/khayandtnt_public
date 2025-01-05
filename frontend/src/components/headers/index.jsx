import { useContext, useState } from 'react'
import logo from '../../assets/rd_logo.png'
import './style.scss'
import { Link } from 'react-router-dom'
import { FaCaretDown, FaMoon, FaSun } from 'react-icons/fa'
import { FaArrowRightToBracket } from 'react-icons/fa6'
import { ThemeContext } from '../../contexts/themeContext'
import { useSelector } from 'react-redux'
import { store } from '../../store'
import { logoutSuccess } from '../../store/authSlice'

export default function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext)
    const [acUser, setAcUser] = useState(false)
    const userName = useSelector(state => state.auth?.user?.data?.name)
    let name = userName.split(' ')

    const handleOpen = () => {
        setAcUser(!acUser)  // Mở hoặc đóng menu đăng xuất khi click vào phần "Hello, Demo"
    }

    const handleLogout = () => {
        store.dispatch(logoutSuccess())
        setAcUser(false); // Đóng menu đăng xuất sau khi logout
    }

    return (
        <header className="header">
            <div className="header__logo">
                <img src={logo} alt="logo" className='header__logo__img'/>
                <Link to="/" className='header__logo__title'>Dashboard</Link>
            </div>    

            <ul className="header__nav">
                <li className='item' onClick={handleOpen}>
                    <p>Hello, <strong>{name[name.length - 1]}</strong> <FaCaretDown/></p>
                    {
                        acUser && (
                            <ul className='listItem'>
                                <li className='menu_item' onClick={handleLogout}>
                                    <p>Đăng xuất</p> <FaArrowRightToBracket/>
                                </li>

                                <li className='menu_item' onClick={toggleTheme}>
                                    <span>Theme</span>{ theme === 'dark' ? <FaMoon/> : <FaSun/> } 
                                </li>
                            </ul>
                        )
                    }
                </li>
            </ul>
        </header>
    )
}
