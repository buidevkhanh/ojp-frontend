import io from 'socket.io-client';
import { SERVER_HOST } from '../../configs/app.config';

const socket = io(SERVER_HOST);

export default socket;