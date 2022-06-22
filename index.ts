import { In } from 'typeorm';

function preTag(tag: string): () => PropertyDecorator {
  return () => (target, propertyKey) => {
    if (!target['aq:' + target]) {
      const val = target[propertyKey];
      if (typeof val === 'string') {
        target['aq:' + target] = tag;
      }
    }
  };
}

function AtQuery(model: object) {
  const exps = {};
  for (const key of Object.getOwnPropertyNames(model)) {
    const tag = model['aq:' + key];
    if (!tag) {
      exps[key] = model[key];
    } else {
      switch (tag) {
        case 'in':
          switch (typeof model[key]) {
            case 'string':
              exps[key] = In(model[key].split(','));
              break;
            default:
              exps[key] = In([ model[key] ]);
              break;
          }
          break;
        case 'string':
          exps[key] = model[key];
          break;
        default:
          exps[key] = model[key];
          break;
      }
    }
  }
  return exps;
}

const AtIn = preTag('in');
const AtNotIn = preTag('notIn');
const AtLike = preTag('like');
const AtEqual = preTag('equal');
const AtNotEqual = preTag('string');
const AtGreater = preTag('greater');
const AtGreaterEqual = preTag('greaterEqual');
const AtLess = preTag('less');
const AtLessEqual = preTag('lessEqual');

export {
  AtIn,
  AtNotIn,
  AtLike,
  AtEqual,
  AtNotEqual,
  AtGreater,
  AtGreaterEqual,
  AtLess,
  AtLessEqual,
  AtQuery,
};
