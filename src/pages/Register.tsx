import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Importamos la conexión
import { createUserWithEmailAndPassword as registroUsuario } from "firebase/auth"
import { useHistory } from "react-router";
import './Home.css';

const Register: React.FC = () => {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [conPassword, setConPassword] = useState(''); //confirmar contraseña
    const [showPassword, setShowPassword] = useState(false);

    const history = useHistory();

    const guardarUsuario = async () => {
        if (password !== conPassword) { //verifica que las contraseñas coincidan
            alert("Las contraseñas no coinciden")
            return;
        }

        try {
            const userCredential = await registroUsuario(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "Usuarios", user.uid), {
                Nombre: nombre,
                Descripcion: descripcion,
                Correo: email,
                Foto: "",
            });
            alert("usuario guardado con éxito")

            setNombre(''); //Limpia todo despues de guardar
            setPassword('');
            setConPassword('');
            setEmail('');
            setDescripcion('');

        } catch (e) {
            console.error("error añadiendo el documento:", e);

        }
    }

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
                            <div className='flex flex-col gap-3 mt-5 self-center'>
                                <IonInput type='text' placeholder='Nombre de usuario' className='input' value={nombre} onIonChange={e => setNombre(e.detail.value!)}></IonInput>
                                <IonInput type='text' placeholder='Hablanos sobre tí' className='input' value={descripcion} onIonChange={e => setDescripcion(e.detail.value!)}></IonInput>
                                <IonInput type='text' placeholder='Correo' className='input' value={email} onIonChange={e => setEmail(e.detail.value!)}></IonInput>
                                <IonInput type='password' placeholder='Contraseña' className='input' value={password} onIonChange={e => setPassword(e.detail.value!)}></IonInput>
                                <IonInput type='password' placeholder='Confirmar Contraseña' className='input' value={conPassword} onIonChange={e => setConPassword(e.detail.value!)}></IonInput>
                                <button onClick={guardarUsuario} className='btn text-3xl italic self-center'>Registrarse</button>
                            </div>
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
