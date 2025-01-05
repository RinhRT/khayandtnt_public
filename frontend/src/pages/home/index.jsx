import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/headers';
import Slide from '../../components/slide';
import './style.scss';

export default function Home() {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth?.user?.data);

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className='homePage'>
            <Header />
            <Slide />
            <div className='Main'>
                <Outlet />
            </div>
        </div>
    );
}
