import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Register: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='fondoPrincipal2'>
                    <div className='flex flex-col align-center h-[80vh] w-[80vw] blurtext bg-white/20 rounded-[29px] backdrop-blur-[100px] shadow-lg mt-[10vh] self-center'>
                        <img src='src/imgs/MAP_LOGO.png' alt='MAP Logo' className='w-[140px] h-[140px] rounded-full self-center mt-5 mb-2 shadow-xl' />
                        <h1 className='self-center font-bold text-2xl text-white'>MAP</h1>
                        <p className='self-center italic text-md text-white'>Music Around People</p>
                        <hr className='w-[70%] self-center border-t border-gray-300 my-2 ' />
                        <div className='flex justify-center bg-[#1B1E3F] h-[60px] w-[200px] self-center rounded-[5px] mt-[10px]'>
                            <h1 className='text-white font-bold text-5xl mt-[5px] shadow-lg'>SIGN UP</h1>
                        </div>
                        <div className='flex flex-col align-center h-[50%] w-[100%] self-center '>
                            <form className='flex flex-col gap-3 mt-5 self-center'>
                                <input type='text' placeholder='Nombre de usuario' className='input'></input>
                                <input type='text' placeholder='Hblanos sobre tí' className='input'></input>
                                <input type='text' placeholder='Correo' className='input'></input>
                                <input type='password' placeholder='Contraseña' className='input'></input>
                                <input type='password' placeholder='Confirmar Contraseña' className='input'></input>
                                <button type='submit' className='btn text-3xl italic self-center'>Registrarse</button>
                            </form>
                        </div>
                        <div className='self-center mt-5'>
                            <p className='italic font-thin'>¿Ya tienes cuenta? <a href='/login' className='text-[#1B1E3F] underline font-bold '>  Login 👤</a></p>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;
