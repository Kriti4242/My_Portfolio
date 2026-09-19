import { useEffect, useState } from 'react';

const TYPE_DELAY = 140;
const DELETE_DELAY = 110;
const WORD_PAUSE = 2200;
const DELETE_PAUSE = 600;

export const useTypewriter = (roles) => {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout;

    if (!isDeleting) {
      if (text.length < currentRole.length) {
        timeout = setTimeout(() => {
          setText(currentRole.slice(0, text.length + 1));
        }, TYPE_DELAY);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, WORD_PAUSE);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentRole.slice(0, text.length - 1));
        }, DELETE_DELAY);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex((previousIndex) => (previousIndex + 1) % roles.length);
        }, DELETE_PAUSE);
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [text, roleIndex, isDeleting, roles]);

  return {
    text,
    isDeleting,
    roleIndex
  };
};
