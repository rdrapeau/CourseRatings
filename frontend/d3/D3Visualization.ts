interface D3Visualization {

  /**
   * Updates the state of the visualization
   * @param {any} state The new state
   */
	update(state : any) : void;

  /**
   * Destroys the visualization (cleanup)
   */
	destroy() : void;
}

export = D3Visualization;