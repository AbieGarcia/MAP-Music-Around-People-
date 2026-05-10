import {
    IonContent, IonIcon, IonItem, IonMenu, IonMenuToggle, IonHeader, IonToolbar
} from '@ionic/react';
import {
    gridOutline, listOutline, addCircleOutline, settingsOutline,
    logOutOutline, chevronForwardOutline, cubeOutline, personCircleOutline, closeOutline, personOutline, musicalNote, peopleOutline, globeOutline
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import React from 'react';

const Menu: React.FC = () => {

    const location = useLocation(); // sirve para ver cual pestaña esta activa y cual item del menú está activo
    const menuOpc = [
        { title: 'Perfil', url: '/', icon: personOutline },
        { title: 'Canciones', url: '/', icon: musicalNote },
        { title: 'MusicMatch', url: '/', icon: peopleOutline },
        { title: 'Mapa', url: '/map', icon: globeOutline },
    ]
    return (
        <IonMenu contentId='main-content' type='overlay' style={{ '--width': '200px', '--height': '72vh', '--background': 'transparent' }} >
            <IonContent style={{ '--background': 'transparent' }}>
                <div className='flex flex-col h-full text-black' style={{ backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', borderRadius: '10px' }}>
                    <img src='src/imgs/MAP_LOGO.png' alt='MAP Logo' className='w-[90px] h-[90px] rounded-full shadow-xl self-center mt-5' />

                    {/*MENU*/}
                    <div className='flex-1 px-3 py-4'>
                        {menuOpc.map((item, index) => (
                            <IonMenuToggle>
                                <IonItem
                                    routerLink={item.url} //ruta de navegacion a diferentes pags
                                    lines='none'
                                    detail={false} //oculta detalles automaticos de ionic
                                    className='p-0 m-0 bg-transparent text-inherit'
                                    style={{ '--background': 'transparent', '--color': 'inherit' }}
                                >
                                    <div className={`flex items-center justify-between w-full p-3 mb-4 rounded-2xl font-bold transition-all
                                        ${location.pathname === item.url
                                            ? 'bg-[#359FB7] text-white'
                                            : 'text-white bg-[#461599]'
                                        }`}>

                                        <div className='flex items-center gap-2'>
                                            <IonIcon icon={item.icon} className={`text-xl
                                        ${location.pathname === item.url
                                                    ? 'text-[#461599]'
                                                    : 'text-[#359FB7]'
                                                }`} />
                                            <span className='font-medium text-md'>{item.title}</span>
                                        </div>
                                    </div>


                                </IonItem>
                            </IonMenuToggle>
                        ))}
                        <div className='flex justify-center ml-3 w-[150px] h-[250px] p-3 mb-4 rounded-2xl transition-all bg-[#359FB7]'>
                            <p className='font-bold text-white'>Última canción</p>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonMenu >
    )
};
export default Menu;