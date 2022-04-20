import React from 'react';
import { useEffect } from 'react'; //useEffect llena el estado cuando se monta el componente
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterCreated, orderByGame, orderByRating, listGenres, filterByGenres } from '../../actions';
import CardList from '../Card/CardList';
import Paginado from '../Paginado/Paginado';
import SortSelect from '../SortSelect/SortSelect';
import './Home.css';
import NavLuci from './navBar.jsx';
import Error from './Error.jsx';


export default function Home() {

    const dispatch = useDispatch(); // conecto a mi componente con Redux

    // ********* RENDERIZADO DE TODOS LOS GAMES ************
    const allVideogames = useSelector((state) => state.videogames) // selecciona el estado global de Redux


    const genress = useSelector(state => state.genres)

    // ordeno los generos alfabéticamente para q sea más facil encontrarlos en el select
    let sortGenres = genress.sort(function (a, b) {
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
    })


    // *********** ORDENAMIENTO ASC - DES  ****************
    const [order, setOrder] = useState('')
    const [sort, setSort] = useState('Orden Por Juego');

    function handleSort(e) {
        e.preventDefault();
        if (sort === "Orden Por Juego") setSort("Orden Por Rating");
        if (sort === "Orden Por Rating") setSort("Orden Por Juego")
    };

    function orderGame(e) { // ordenamiento por nombre
        dispatch(orderByGame(e.target.value))
        setPagActual(1);
        setOrder(e.target.value)
    };


    function orderRating(e) { // ordenamiento por rating
        dispatch(orderByRating(e.target.value))
        setPagActual(1);
        setOrder(e.target.value)
    };


    //  ********** PARA EL PAGINADO **********************
    const [pagActual, setPagActual] = useState(1)
    const [gamesPorPag, setGamesPorPag] = useState(15)
    const indexUltimoGame = pagActual * gamesPorPag
    //  inicialmente 15   ->    1      *    15

    const indexPrimerGame = indexUltimoGame - gamesPorPag
    //  inicialmente 0   ->      15      -       15

    const gamesPagActual = allVideogames.slice(indexPrimerGame, indexUltimoGame)
    // me traigo esa porción de juegos del 1 al 14

    const paginado = (pagNum) => {
        setPagActual(pagNum)
    }

    useEffect(() => {
        dispatch(listGenres())
    }, []);

    // FILTRO SEGÚN ORIGEN
    function handleFilterByCreated(e) {
        dispatch(filterCreated(e.target.value))
    };

    // FILTRO POR GÉNERO
    function handleFilterByGenres(e) {
        e.preventDefault();
        dispatch(filterByGenres(e.target.value))
    };



    return (
        <div className='home'>

            <div>
                <NavLuci />
            </div>

            <br />
            <div className='games'>
                <h1 className='Videogames'>Videogames</h1>
            </div>
            <br />

            <div class="row g-4">
                <div class="col-md-3">
                    <div class="form-floating">
                        <select class="form-select"
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            onChange={e => handleFilterByCreated(e)}>
                            {/* <option selected>Todos Los Juegos</option> */}
                            <option value="1">Todos Los Juegos</option>
                            <option value="2">Creaciones</option>
                        </select>
                        <label className='fuerte' for="floatingSelect">Filtro por Origen</label>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="form-floating">
                        <select class="form-select"
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            onChange={e => handleFilterByGenres(e)}>
                            {/* <option value="4">Todos Los Géneros</option> */}
                            {sortGenres &&
                                sortGenres.map(el => (
                                    <option
                                        value={el}>{el}</option>
                                ))}
                        </select>
                        <label className='fuerte' for="floatingSelect">Filtro por Género</label>
                    </div>
                </div>

                {/* <div class="col-md">
                    <div class="form-floating">
                        <select class="form-select"
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            onChange={e => handleSort(e)}>
                            <option selected>abc</option>
                            <option value="5">Ascendente</option>
                            <option value="6">Descendente</option>
                        </select>
                        <label className='fuerte' for="floatingSelect">Ordenamiento</label>
                    </div>
                </div> */}

                <div class="col-md-3">
                    

                        <button type="button"
                            class="btn"
                            style={{ width: "70%" }}
                            value={sort}
                            onClick={(e) => handleSort(e)}
                        >{sort}</button>

                        {sort === "Orden Por Juego" ? (
                            
                                <SortSelect
                                    handleSort={orderGame}
                                    sortDescription="Orden Alfabético"
                                />
                           
                        ) : (
                            
                                <SortSelect
                                    handleSort={orderRating}
                                    sortDescription="Orden Alfabético"
                                />
                           
                        )}


                    
                </div>
            </div>

            <br />
            <Paginado
                gamesPorPag={gamesPorPag}
                allVideogames={allVideogames.length}
                paginado={paginado}
            />
            <br />



            <div>
                {
                    allVideogames === "VideoGame no encontrado" ? <Error /> :

                        <CardList games={gamesPagActual} />
                }
            </div>



        </div >
    )
}
