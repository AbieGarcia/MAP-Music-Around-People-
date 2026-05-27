import { Route, Redirect } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';

const PrivateRoute = (props: any) => {
    const ComponenteProtegido = props.component;
    const { component, ...rest } = props;
    const [user] = useAuthState(auth);
    return (
        <Route
            {...rest}
            render={(routerProps) =>
                user ? <ComponenteProtegido {...routerProps} />
                    : <Redirect to="/login" />
            }
        />
    );
};
export default PrivateRoute;