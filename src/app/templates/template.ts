// import * as _ from 'lodash';

/**
 * Applications table
 * @PK userId
 * @FK projectListId, sharedProjectId
 * @param 
 */
export interface IApp {
    user: IUser,
    projects: IProject[],
    shared_projects: ISharedProjects[]
}
/**
 * Users table
 * @PK id
 * @FK 
 * @param name
 */
export interface IUser {
    id: string,
    name: string
}
export interface IProject {
    id: string,
    name: string,
    description?: string,
    image?: string,
    label: ILabel,
    // share?: IShare[],
    attributes: IAttribute[],
    plots: IPlot[]
}
export interface ILabel {
    x: [string, string],
    y: [string, string],
    z?: [string, string]
}
// export interface IShare {
//     project_id: string,
//     user_id: string,
//     autority: 0 | 1 | 2
// }
export interface IAttribute {
    id: string,
    name: string,
    configs?: IConfig[]
}
export interface IConfig {
    id: string,
    name: string,
    arguments?: any[]
}
export interface IPlot {
    id: string,
    name: string,
    created_user_id: string,
    coordinate: {
        x: number,
        y: number,
        z?: number
    },
    belongs?: IBelong[]
}
export interface IBelong {
    attribute_id: string,
    is_checked: Boolean
}

export interface ISharedProjects {
    user_id: string,
    project_id: string,
    autority: 0 | 1 | 2
}

/**
 * JSON template definition
 */
export class Template {
    // constructor() { };

    /**
     * Entire app JSON
     * @return { user, settings[], projects[] }
     */
    static app():IApp {
        return {
            user: {
                id: 'default',
                name: 'NoUser'
            },
            // settings: [this.setting()],
            projects: [this.project()],
            shared_projects: [this.shared_projects()]
        };
    };

    /**
     * User setting information
     * @return { id, name, is_checked }
     */
    // setting() {
    //     return {
    //         id: '',
    //         name: '',
    //         is_checked: false
    //     };
    // };

    /**
     * Project setting information
     * @return { id, name, label{}, attributes[], plots[] }
     */
    static project():IProject {
        return {
            id: 'default',
            name: 'New Project',
            image: '',
            description: 'This is new project. You can write description here.',
            // share: [],
            label: {
                x: ['-x-label', '+x-label'],
                y: ['-y-label', '+y-label'],
                z: ['-z-label', '+z-label']
            },
            attributes: [this.attribute()],
            plots: [this.plot()]
        };
    };

    /**
     * Attribute settings attaching to plots
     * @return { id, name, configs[] }
     */
    static attribute():IAttribute {
        return {
            id: 'default',
            name: 'New Attribute',
            configs: [this.config()]
        };
    };

    /**
     * Configure settings operating plots
     * @return { id, name, arguments[]}
     */
    static config():IConfig {
        return {
            id: 'default',
            name: 'New configuration',
            arguments: ['']
        };
    };

    /**
     * Plot information
     * @return { id, name, coordinate{}, belongs[] }
     */
    static plot():IPlot {
        return {
            id: '',
            created_user_id: '', 
            name: 'New Plot',
            coordinate: {
                x: 0,
                y: 0,
                z: 0
            },
            belongs: [this.belong()]
        };
    };

    /**
     * Attributes belonged by plot
     * @return {attribute_id, is_checked}
     */
    static belong():IBelong {
        return {
            attribute_id: 'default',
            is_checked: false
        };
    };

    static shared_projects():ISharedProjects {
        return {
            user_id: 'guest',
            project_id: 'shared_sample',
            autority: 2
        }
    }

    static sample():IApp {
        return {
            user: {
                id: 'anonymous',
                name: 'guest'
            },
            projects: [{
                id: 'prj1',
                name: '犬',
                description: '犬をかわいい、かっこいいマッピングする',
                image: 'https://material.angular.io/assets/img/examples/shiba2.jpg',
                // share: [{
                //     project_id: 'prj1',
                //     user_id: 'guest',
                //     autority: 2
                // }],
                label: {
                    x: ['かわいい', 'かっこいい'],
                    y: ['小さい', '大きい']
                },
                attributes: [{
                    id: 'attr',
                    name: '色変更',
                    configs: [{
                        id: 'conf1',
                        name: '赤',
                        arguments: ['#ff0000']
                    },{
                        id: 'conf2',
                        name: '青',
                        arguments: ['#0000ff']
                    }]
                }],
                plots: [{
                    id: 'plt1',
                    name: 'チワワ',
                    created_user_id: 'guest',
                    coordinate: {
                        x: -50,
                        y: -50
                    },
                    belongs: [{
                        attribute_id: 'attr1',
                        is_checked: false
                    }]
                },{
                    id: 'plt2',
                    name: 'ダックスフンド',
                    created_user_id: 'guest',
                    coordinate: {
                        x: 50,
                        y: -50
                    },
                    belongs: [{
                        attribute_id: 'attr2',
                        is_checked: false
                    }]
                },{
                    id: 'plt3',
                    name: 'シェパード',
                    created_user_id: 'guest',
                    coordinate: {
                        x: 50,
                        y: 50
                    },
                    belongs: [{
                        attribute_id: 'attr1',
                        is_checked: false
                    }]
                },{
                    id: 'plt4',
                    name: 'ラブラドール',
                    created_user_id: 'guest',
                    coordinate: {
                        x: -50,
                        y: 50
                    },
                    belongs: [{
                        attribute_id: 'attr1',
                        is_checked: false
                    }]
                },{
                    id: 'plt5',
                    name: 'パピヨン',
                    created_user_id: 'guest',
                    coordinate: {
                        x: 67,
                        y: -40
                    },
                    belongs: [{
                        attribute_id: 'attr1',
                        is_checked: false
                    }]
                },{
                    id: 'origin',
                    name: '柴犬',
                    created_user_id: 'guest',
                    coordinate: {
                        x: 0,
                        y: 0
                    },
                    belongs: [{
                        attribute_id: 'attr1',
                        is_checked: false
                    }]
                }],
            }, {
                id: 'prj2',
                name: 'dummy2',
                description: 'This is description for dummy', 
                // share: [],
                label: {
                    x: ['-x-label', '+x-label'],
                    y: ['-y-label', '+y-label']
                },
                attributes: [{
                    id: 'attr',
                    name: '色変更',
                    configs: [{
                        id: 'conf1',
                        name: '赤',
                        arguments: ['#ff0000']
                    },{
                        id: 'conf2',
                        name: '青',
                        arguments: ['#0000ff']
                    }]
                }],
                plots: [{
                    id: 'plt1',
                    name: 'plot1',
                    created_user_id: 'guest',
                    coordinate: {
                        x: 1,
                        y: 1
                    },
                    belongs: [{
                        attribute_id: 'attr2',
                        is_checked: false
                    }]
                }]
            }],
            shared_projects: [{
                user_id: 'sample',
                project_id: 'prj1',
                autority: 2
            }]
        };
    };
}
