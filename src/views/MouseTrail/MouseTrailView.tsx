import React from "react";
import { observer } from "mobx-react";
import { MouseTrailStore, TrailPoint } from "../../stores/MouseTrailStore";
import "./MouseTrailView.scss";

interface MouseTrailViewProps {
  store: MouseTrailStore;
}
/**Establishes the view for a mouse trail */
@observer
export class MouseTrailView extends React.Component<MouseTrailViewProps> {
  render() {
    const { points } = this.props.store;

    return (
      <div className="mouse-trail-overlay">
        {points.map((p: TrailPoint) => (
          <div
            key={p.id}
            className="mouse-trail-point"
            style={{
              left: p.x + "px",
              top: p.y + "px",
            }}
          />
        ))}
      </div>
    );
  }
}
