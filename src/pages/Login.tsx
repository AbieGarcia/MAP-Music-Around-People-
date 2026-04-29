import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Login: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='fondoPrincipal'>
                    <div className='flex flex-col align-center h-[80vh] w-[80vw] blurtext bg-white/20 rounded-[29px] backdrop-blur-[100px] shadow-lg mt-[10vh] self-center'>
                        <img src='src/imgs/MAP_LOGO.png' alt='MAP Logo' className='w-[140px] h-[140px] rounded-full self-center mt-5 mb-2 shadow-xl' />
                        <h1 className='self-center font-bold text-2xl text-white'>MAP</h1>
                        <p className='self-center italic text-md text-white'>Music Around People</p>
                        <hr className='w-[70%] self-center border-t border-gray-300 my-2 ' />
                        <div className='flex justify-center bg-[#1B1E3F] h-[60px] w-[160px] self-center rounded-[5px] mt-[10px]'>
                            <h1 className='text-white font-bold text-5xl mt-[5px] shadow-lg'>LOGIN</h1>
                        </div>
                        <div className='flex flex-col align-center h-[50%] w-[100%] self-center mt-5'>
                            <form className='flex flex-col gap-10 mt-5 self-center'>
                                <input type='text' placeholder='Correo' className='input'></input>
                                <input type='password' placeholder='Contraseña' className='input'></input>
                                <button type='submit' className='btn text-3xl italic self-center'>Login</button>
                            </form>
                        </div>
                        <div className='self-center mt-[-40px]'>
                            <p className='italic font-thin'>¿Sin una cuenta? <a href='/register' className='text-[#1B1E3F] underline font-bold '>  Regístrate 🎵</a></p>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
