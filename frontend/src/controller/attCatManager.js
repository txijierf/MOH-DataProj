import axios from "axios";
import config from "./../config/config";
import {generateObjectId, check, axiosConfig} from './common';

/**
 * Singleton Pattern
 */
let instance = null;

export default class AttCatManager {

  constructor(props) {
    if (!instance) {
      instance = this;
      // init
      this.props = props;
    }
    return instance;
  }

  add(isAttribute, id, name, description) {
    const what = isAttribute ? 'attribute' : 'category';
    return axios.post(config.server + '/api/v2/' + what, {id, name, description}, axiosConfig)
      .then(response => {
        if (check(response)) {
          return response.data;
        }
      });
  }

  batchAdd(isAttribute, data) {
    const what = isAttribute ? 'attribute' : 'category';
    return axios.post(config.server + '/api/v2/batch/' + what, {data}, axiosConfig)
      .then(response => {
        if (check(response)) {
          return response.data;
        }
      });
  }

  /**
   * Get attribute or category
   * @param isAttribute
   * @return {Promise<AxiosResponse<T> | never>}
   */
  get(isAttribute) {
    const what = isAttribute ? 'attribute' : 'category';
    return axios.get(config.server + '/api/v2/' + what, axiosConfig)
      .then(response => {
        if (check(response)) {
          const data = response.data.data;
          const res = [];
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            res.push([item.id, item.name, item.description || '', item._id, item.groups]);
          }
          return res;
        }
      })
  }

  delete(isAttribute, ids) {
    const what = isAttribute ? 'attribute' : 'category';
    return axios.delete(config.server + '/api/v2/' + what + '', {
      data: {ids: ids},
      withCredentials: axiosConfig.withCredentials
    })
      .then(response => {
        if (check(response)) {
          return response.data;
        }
      })
  }

  assignGroups(isAttribute, data) {
    const what = isAttribute ? 'attribute' : 'category';
    return axios.post(`${config.server}/api/v2/${what}/assign/group`, data, axiosConfig)
      .then(response => {
        if (check(response)) {
          return response.data;
        }
      })
  }

  generateId(isAttribute) {
    const what = isAttribute ? 'attribute' : 'category';
    return axios.get(`${config.server}/api/v2/${what}/generate/id`, axiosConfig)
      .then(response => {
        if (check(response)) {
          return response.data.id;
        }
      })
  }

  /**
   * @param {boolean} isAttribute
   * @param labelName
   * @return {*}
   */
  getGroup(isAttribute, labelName = 'title') {
    const what = isAttribute ? 'attribute' : 'category';
    return axios.get(`${config.server}/api/v2/${what}/group`, axiosConfig)
      .then(response => {
        if (check(response)) {
          return response.data;
        }
      })
      .then(data => {
        return this._buildTree(data.documents, labelName);
      })
  }

  getAttributeGroup = () => this.getGroup(true);

  getCategoryGroup = () => this.getGroup(false);

  updateGroup(isAttribute, tree) {
    const what = isAttribute ? 'attribute' : 'category';
    return axios.post(`${config.server}/api/v2/${what}/group`, {documents: this._flatTree(tree)}, axiosConfig)
      .then(response => {
        if (check(response)) {
          return response.data;
        }
      });
  }

  updateAttributeGroup = (tree) => this.updateGroup(true, tree);

  updateCategoryGroup = (tree) => this.updateGroup(false, tree);

  removeGroup(isAttribute, _id) {
    console.log("Removing group", _id);
    const what = isAttribute ? 'attribute' : 'category';
    return axios.delete(`${config.server}/api/v2/${what}/group/${_id}`, axiosConfig)
      .then(response => {
        if (check(response)) {
          return response.data;
        }
      });
  }

  removeAttributeGroup = (_id) => this.removeGroup(true, _id);

  removeCategoryGroup = (_id) => this.removeGroup(false, _id);

  // TODO : Transfer methods elsewhere - doesn't belong here
  getGrouplookup = () => {
    console.log("Fetching groups");
    return axios.get(`${config.server}/api/v2/grouplookup`, axiosConfig)
      .then(response => {
        if(check(response)) {
          return response.data;
        }
      });
  };

  // getGroupLookupGroup = (group) => {
  //   return axios.get(`${config.server}/api/v2/grouplookup/${group}`, axiosConfig)
  //     .then(response => {
  //       if(check(response)) {
  //         return response.data;
  //       }
  //     });
  // };

  // getPeriods = () => {
  //   return axios.get(`${config.server}/api/v2/period`, axiosConfig)
  //     .then(response => {
  //       if(check(response)) {
  //         return response.data;
  //       }
  //   });
  // }

  // addPeriod = () => {
  //   return axios.get(`${config.server}/api/v2/period`, axiosConfig)
  //     .then(response => {
  //       if(check(response)) {
  //         return response.data;
  //       }
  //     });
  // }

  // addGrouplookupGroup = (title) => {
  //   console.log("Adding group", title);
  //   return axios.post(`${config.server}/api/v2/grouplookup`, { title }, axiosConfig)
  //     .then(response => {
  //       if(check(response)) {
  //         return response.data;
  //       }
  //     });
  // };

  // deleteGroupLookupGroup = (title) => {
  //   return axios.delete(`${config.server}/api/v2/grouplookup/${title}`, axiosConfig)
  //     .then(response => {
  //       if(check(response)) {
  //         return response.data;
  //       }
  //     });
  // }

  /**
   * Generate a _id
   * @param {number} [number=1]
   * @return {Promise<AxiosResponse<T> | never>}
   */
  generateObjectId = generateObjectId;

  /**
   * Build group tree.
   * @param documents
   * @param labelName
   * @param [currNode]
   * @param [tree]
   * @param {Array} [childIds] - array of ids
   * @private
   */
  _buildTree(documents, labelName, currNode, tree = [], childIds) {
    // basis
    if (currNode == null) {
      for (let document of documents) {
        if (!document.parent) {
          // does not have parent, master node
          tree.push({ [labelName]: document.name, _id: document._id, properties: document.properties, children: [] });
          this._buildTree(documents, labelName, tree[tree.length-1], tree, document.children);
        }
      }
      return tree;
    } else {
      if (childIds.length === 0) return;
      for (let document of documents) {
        if (childIds.includes(document._id)) {
          currNode.children.push({ [labelName]: document.name, _id: document._id, properties: document.properties, children: [] });
          this._buildTree(documents, labelName, tree[tree.length-1], tree, document.children);
        }
      }
    }
  }

  _flatTree(tree, documents = [], currNode, currDocument) {
    // basis
    if (!currNode) {
      for (let node of tree) {
        documents.push({ _id: node._id, name: node.title, properties: node.properties, children: [] });
        this._flatTree(tree, documents, node, documents[documents.length-1]);
      }
      return documents;
    } else {
      if (!currNode.children || currNode.children.length === 0) return;
      for (let node of currNode.children) {
        currDocument.children.push(node._id);
        documents.push({ _id: node._id, name: node.title, properties: node.properties, children: [], parent: currNode._id });
        this._flatTree(tree, documents, node, documents[documents.length-1]);
      }
    }
  }
}
