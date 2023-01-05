import './App.css';
import BoardPipeline from "./components/Board/BoardPipeline";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                Board
            </header>
            <BoardPipeline stages={['Idea', 'Development', 'Testing', 'Deployment']}/>
        </div>
    );
}

export default App;
