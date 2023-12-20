import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter.js'
import NavBar from './components/NavBar.js'
import 'bootstrap/dist/css/bootstrap.min.css'

import { AppContext } from './components/AppContext.js'
import { check as checkAuth } from './http/userAPI.js'
import { useState, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Loader from './components/Loader.js'

import { fetchBasket } from './http/basketAPI.js'

import { Link } from 'react-router-dom';

import axios from 'axios'

const App = observer(() => {
    const { user, basket } = useContext(AppContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([checkAuth(), fetchBasket()])
            .then(
                axios.spread((userData, basketData) => {
                    if (userData) {
                        user.login(userData)
                    }
                    basket.products = basketData.products
                })
            )
            .finally(
                () => setLoading(false)
            )
    }, [])

    // показываем loader, пока получаем пользователя и корзину
    if (loading) {
        return <Loader />
    }

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
            <object type="text/html" data="http://localhost:4000/"
            width="500" height="700" hspace="1300" vspace="4"></object>
        </BrowserRouter>
    )
})

export default App
