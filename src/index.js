import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  let fStyle= {
            backgroundColor: props.highligt? 'yellow': 'white'
          }; 

    return (
      <button style={fStyle} className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i, highligt) {
    return <Square value={this.props.squares[i]} highligt={highligt} onClick={()=>this.props.onClick(i)} />;
  }

  renderBoard(){
    let board=[], si=0;

    for(let i=0; i<3; i++){
      let childs=[];

      for(let j=0; j<3; j++){
        let highligt=false;
        if(this.props.winner && this.props.winner.indexOf(si)>-1) highligt=true; 
        let cell=this.renderSquare(si++, highligt);
        childs.push(cell);
      }
      board.push(<div className="board-row">{childs}</div>);
    }
    return board;
  }

  render() {
  
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
    
    constructor(props){
        super(props);
        this.state={
            history: [{
                squares: Array(9).fill(null),
                row: 0,
                column: 0
            }],
            stepNumber: 0,
            xIsNext: true,
            isAsc: true
        }
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2)===0
        })
    }
    
    handleClick(i){
        const history=this.state.history.slice(0, this.state.stepNumber+1);
        const current=history[history.length-1];
        const squares= current.squares.slice();
        if(calculateWinner(squares) || squares[i]) return;

        squares[i]= this.state.xIsNext? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                row: Math.floor(i/3)+1,
                column: (i%3)+1
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    toggle(){
      this.setState({
        isAsc: !this.state.isAsc
      })
    }

  render() {
    let history = this.state.history.slice(0);
    const current= history[this.state.stepNumber];
    if(!this.state.isAsc) history=history.reverse();

    const moves= history.map((value, ind)=>{
       let index=this.state.isAsc? ind: history.length-1-ind;
        const desc= (index? 'Go to move: '+ index : 'Go to game start')
            +(index? ` (Row: ${value.row} Column: ${value.column})`: '');
        let fStyle= {
          fontWeight: index==this.state.stepNumber? 'bold': 'normal',
          minWidth: '110px'
        };        
        return(
            <li key={index}>
                <button style={fStyle} onClick={()=>this.jumpTo(index)}>{desc}</button>
            </li>
        );
    });

    let status;
    const winner=calculateWinner(current.squares);
    if (winner) status = 'Winner: ' + winner[0];
    else{
      status = 'The game is drawn.';
      current.squares.map((sqr)=>{
        if(sqr==null) status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); 
      });      
    } 
    
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winner={winner? winner[1]: null} onClick={(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.toggle()} >{this.state.isAsc? 'Asc': 'Desc'}</button>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares){
    const lines=[
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for(let i=0; i<lines.length; i++){
        const [a, b, c]=lines[i];
        if(squares[a] && squares[a]===squares[b] && squares[b]===squares[c])
        return [squares[a], lines[i]];
    }
    return null;
}