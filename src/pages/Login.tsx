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
                        <p className='self-center italic text-sm text-white'>Music Around People</p>
                        <hr className='w-[70%] self-center border-t border-gray-300 my-2 ' />
                        <div className='flex justify-center bg-[#1B1E3F] h-[45px] w-[150px] self-center rounded-[5px]'>
                            <h1 className='text-white font-bold text-4xl mt-[3px]'>LOGIN</h1>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
