import { nanoid } from 'nanoid';

function transformBlock(block) {
  const transformedBlock = {
    _key: nanoid(),
  };

  if (block.type === 'paragraph') {
    transformedBlock._type = 'block';
    transformedBlock.style = 'normal';
    transformedBlock.markDefs = [];
  } else if (block.type === 'text') {
    transformedBlock._type = 'span';
  }

  if (block.marks) {
    transformedBlock.marks = [];
    if (block.marks.find((m) => m.type === 'italic')) {
      transformedBlock.marks.push('em');
    }
    if (block.marks.find((m) => m.type === 'bold')) {
      transformedBlock.marks.push('strong');
    }
  }

  if (block.content) {
    transformedBlock.children = block.content.map((child) =>
      transformBlock(child),
    );
  }

  if (block.text) {
    transformedBlock.text = block.text;
  }

  return transformedBlock;
}

export function prosemirrorToSanityBlocks(proseMirrorContent) {
  return proseMirrorContent.content.map((block) => transformBlock(block));
}
