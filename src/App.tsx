import './App.css'; // Import CSS
import { MainScreen } from './MainScreen';
import { WorkspaceProvider } from './features/workspace/context/WorkspaceContext';
import { ChatHistoryProvider } from './features/chat/context/ChatHistoryContext';
import { AppThemeProvider } from './themeContext';

function App() {
  return (
    <AppThemeProvider>
      <WorkspaceProvider>
        <ChatHistoryProvider>
          <MainScreen />
        </ChatHistoryProvider>
      </WorkspaceProvider>
    </AppThemeProvider>
  );
}

export default App;