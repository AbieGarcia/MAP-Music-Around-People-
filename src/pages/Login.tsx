import { useIonRouter, IonInput, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from "react-router";
import { signInWithEmailAndPassword as loginUsuario } from "firebase/auth";
import { auth } from '../firebaseConfig'; // Importamos la conexión
import { useState } from 'react';
import './Home.css';

const Login: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const router = useIonRouter();

    //Comprueba con la base de datos que exista el usuario e inicia secion
    const handleLogin = async () => {
        try {
            await loginUsuario(auth, email, password);
            alert("Bienvenido de nuevo");
            router.push("/map");
        } catch (error: any) {
            if (error.code === 'auth/user-notfound' || error.code === 'auth/wrong-password') {
                alert("Correo o contraseña incorrectos");
            } else {
                alert("Error al iniciar sesion");
            }
        }
    }

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
                            <div className='flex flex-col gap-10 mt-5 self-center'>
                                <IonInput type='text' placeholder='Correo' className='input' value={email} onIonChange={e => setEmail(e.detail.value!)}></IonInput>
                                <IonInput type='password' placeholder='Contraseña' className='input' value={password} onIonChange={e => setPassword(e.detail.value!)}></IonInput>
                                <button className='btn text-3xl italic self-center' onClick={handleLogin}>Login</button>
                            </div>
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
