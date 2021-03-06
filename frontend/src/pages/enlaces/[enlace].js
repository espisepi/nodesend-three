import Layout from '@/components/dom/Layout';
import clienteAxios from '@/config/axios';
import React, {useState, useContext, useEffect } from 'react';
import appContext from '@/context/app/appContext';
import Alerta from '@/components/dom/Alerta';

import dynamic from 'next/dynamic'
const Model = dynamic(() => import('@/components/canvas/Model'), {
    ssr: false,
})

export async function getServerSideProps({params}) {
    const { enlace } = params;

    // console.log(enlace)
   const resultado = await clienteAxios.get(`/api/enlaces/${enlace}`);

//    console.log(resultado);

    return {
        props: {
            enlace: resultado.data
        }
    }
}

export async function getServerSidePaths() {
        const enlaces = await clienteAxios.get('/api/enlaces');
        return {
            paths: enlaces.data.enlaces.map( enlace => ( {
                params: { enlace : enlace.url }
            })),
            fallback: false
        }
}



export default ({enlace}) => {

    // Context de la app
    const AppContext = useContext(appContext);
    const {  mostrarAlerta, mensaje_archivo } = AppContext;
    

    const [ tienePassword, setTienePassword ] = useState(enlace.password);
    const [ password, setPassword ] = useState('');

    console.log(tienePassword)

    //  console.log(enlace);

    const verificarPassword = async e => {
        e.preventDefault();

        const data = {
            password
        }

        try {
            const resultado = await clienteAxios.post(`/api/enlaces/${enlace.enlace}`, data);
            setTienePassword(resultado.data.password);
        } catch (error) {
            mostrarAlerta(error.response.data.msg);
        }
        

    }

    const frontendURL = process.env.frontendURL || 'http://localhost:3000'
    const backendURL = process.env.backendURL || 'http://localhost:4000'

    useEffect(() => {
        const div_canvas = document.getElementById('div_canvas')
        const { zIndex, width, height, top } = div_canvas.style // copy to restore default values
        div_canvas.style.zIndex = 2000
        div_canvas.style.width = '100%'
        div_canvas.style.height = '40vh'
        div_canvas.style.top = '50vh'
        console.log(div_canvas)
        return () => {
            
        }
    }, [])

    return (
        <>
        <Layout>
            {
                tienePassword ? (
                    <>
                        <p className="text-center">Este enlace esta protegido por un password, colocalo a continuaci??n</p>

                        { mensaje_archivo && <Alerta /> }
                        <div className="flex justify-center mt-5">
                            <div className="w-full max-w-lg">
                                <form
                                    className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={ e => verificarPassword(e) }
                                >
                                    <div className="mb-4">
                                        <label 
                                            className="block text-black text-sm font-bold mb-2"
                                            htmlFor="password"
                                        >Password</label>
                                        <input
                                            type="password"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="password"
                                            placeholder="Password del enlace"
                                            value={password}
                                            onChange={ e => setPassword(e.target.value) }
                                        />
                                    </div>

                                    <input 
                                        type="submit"
                                        className="bg-red-500 hover:bg-gray-900 w-full p-2 text-white uppercase font-bold"
                                        value="Validar Password..."
                                    />
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl text-center text-gray-700">Descarga tu archivo:</h1>
                        <div className="flex items-center justify-center mt-10">
                            <a 
                                href={`${backendURL}/api/archivos/${enlace.archivo}`} 
                                className="bg-red-500 text-center px-10 py-3 rounded uppercase font-bold text-white cursor-pointer"
                                download    
                            >Aqu??</a>
                        </div>
                    </>
                )
            }

        </Layout>

        <Model r3f src={`${backendURL}/api/archivos/${enlace.archivo}`} />
        </>
    )
}