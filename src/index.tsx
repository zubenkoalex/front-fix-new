import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { setupStore } from './store';

const store = setupStore();

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
)