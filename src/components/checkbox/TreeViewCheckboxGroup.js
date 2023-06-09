import React from "react";
import styled from "styled-components/macro";
import { TreeView as MuiTreeView, TreeItem } from "@mui/lab";
import { Checkbox, FormControlLabel } from "@mui/material";

const TreeView = styled(MuiTreeView)`
  width: 100%;
  height: calc(100vh - 200px);
  overflow-y: scroll;
  padding: 20px 10px;
`;

const TreeViewCheckboxGroup = ({
  data,
  options,
  selected,
  setSelected,
  setSelectedOptions,
  onSelectedOptionsChanged,
  ...props
}) => {
  function getChildById(node, id) {
    let array = [];

    function getAllChild(nodes) {
      if (nodes === null) return [];
      array.push(nodes.id);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    function getNodeById(nodes, id) {
      if (nodes.id === id) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach((node) => {
          if (!!getNodeById(node, id)) {
            result = getNodeById(node, id);
          }
        });
        return result;
      }

      return null;
    }

    return getAllChild(getNodeById(node, id));
  }

  function getOnChange(checked, nodes) {
    const allNode = getChildById(data, nodes.id);
    let array = checked
      ? [...selected, ...allNode]
      : selected.filter((value) => !allNode.includes(value));
    let selectedOptions = options;

    array = array.filter((v, i) => array.indexOf(v) === i);
    // update check status for 'all' option
    if (
      options.length !==
      array.filter((v) => v.includes("-") && v !== data.id).length
    )
      array = array.filter((v) => v !== data.id);
    else array.push(data.id);

    // update check status for parent option
    if (nodes.id.includes("-")) {
      const parent = nodes.id.split("-")[0]; // get parent node id
      const family = getChildById(data, parent); //get all nodes of selected node
      const otherChildren = family.filter(
        (item) => item !== parent && item !== nodes.id
      );
      if (!checked) array = array.filter((v) => v !== parent);
      else {
        const allChecked = otherChildren.every((child) => {
          return selected.includes(child);
        });
        if (allChecked) array.push(parent);
      }
    }

    selectedOptions = selectedOptions.filter((option) =>
      array.includes(option.id)
    );

    setSelected(array);
    setSelectedOptions(selectedOptions);

    onSelectedOptionsChanged(selectedOptions);
  }

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <FormControlLabel
          control={
            <Checkbox
              checked={
                selected.some((item) => item === nodes.id) ||
                // see if can check the parent item
                (Array.isArray(nodes.children) &&
                  nodes.children
                    .map((child) => child.id)
                    .every((childId) => selected.includes(childId))) ||
                // see if can check the top item
                options.length ===
                  selected.filter((v) => v.includes("-") && v !== data.id)
                    .length
              }
              onChange={(event) =>
                getOnChange(event.currentTarget.checked, nodes)
              }
              onClick={(e) => e.stopPropagation()}
            />
          }
          label={<>{nodes.name}</>}
          key={nodes.id}
        />
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return <TreeView {...props}>{renderTree(data)}</TreeView>;
};

export default TreeViewCheckboxGroup;
