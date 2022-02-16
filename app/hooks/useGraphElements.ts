import _ from "lodash";
import dagre from "dagre";
import { Edge, isNode, Node, Position } from "react-flow-renderer";

import { PackageLock } from "~/types/package-lock";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: "LR" });

const nodeWidth = 180;
const nodeHeight = 35;

export const useGraphElements = (packageLock?: PackageLock): (Node | Edge)[] => {
  if (_.isNil(packageLock)) {
    return [];
  }

  const elements: (Node | Edge)[] = _.chain(packageLock?.packages)
    .entries()
    .flatMap(([packagePath, { dependencies, name: packageName }]) => {
      const packageId = _.replace(packagePath, /^node_modules\//, "") || packageLock.name;

      const node = {
        id: packageId,
        type: "default",
        data: { label: packageId },
        position: { x: 0, y: 0 },
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        draggable: false,
        connectable: false,
      };
      const edges = _.chain(dependencies)
        .entries()
        .map(([depName, dep]) => ({
          id: `${packageId}__${depName}`,
          source: packageId,
          target: depName,
          type: "smoothstep",
        }))
        .value();

      return [node, ...edges];
    })
    .value();

  elements.forEach((entity) => {
    if (isNode(entity)) {
      dagreGraph.setNode(entity.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(entity.source, entity.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((element) => {
    if (isNode(element)) {
      const nodeWithPosition = dagreGraph.node(element.id);

      element.position = {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      };
    }

    return element;
  });
};
