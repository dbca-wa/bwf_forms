export class Renderer {
  constructor(control, props = {}) {
    this.control = control;
    this.props = props;
  }

  renderButtons() {}

  afterRender() {}

  render() {
    console.log('Rendering renderer');
  }

  getValues() {
    return this.control.getFieldValue();
  }
}
