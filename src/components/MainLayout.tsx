import Menu from '../components/Menu';
import {
    IonPage,
    IonContent,
} from '@ionic/react';

interface MainLayoutProps {
    title: string;
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
    return (
        <>
            <Menu />
            <IonPage id="main-content">
                <IonContent>
                    {children}
                </IonContent>
            </IonPage>
        </>
    )
};

export default MainLayout;