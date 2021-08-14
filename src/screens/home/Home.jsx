import React from 'react';
import Itemswheel from '../../components/itemswheel/ItemsWheel';
import Navbar from '../../components/navbar/Navbar';
import './Home.scss'
const Home = () => {
    return (
        <div className="home">
            <Navbar/>
            <Itemswheel/> 
        </div>
    );
}

export default Home;
