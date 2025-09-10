import './App.css'; // Import CSS
import { MainScreen } from './MainScreen';
import { WorkspaceProvider } from './features/workspace/context/WorkspaceContext';
import { ChatHistoryProvider } from './features/chat/context/ChatHistoryContext';

function App() {
  return (
    <WorkspaceProvider>
      <ChatHistoryProvider>
        <MainScreen />
      </ChatHistoryProvider>
    </WorkspaceProvider>
  );
}

export default App;