'use client';

import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
// TODO: updateChatVisibility should be provided by the consuming app
// import { updateChatVisibility } from '@/app/(chat)/actions';
import {
  getChatHistoryPaginationKey,
  type ChatHistory,
} from '@repo/ui/components/sidebar-history';
import type { VisibilityType } from '@repo/ui/components/visibility-selector';

export function useChatVisibility({
  chatId,
  initialVisibilityType,
}: {
  chatId: string;
  initialVisibilityType: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
  const history: ChatHistory = cache.get('/api/history')?.data;

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibilityType,
    },
  );

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility;
    const chat = history.chats.find((chat) => chat.id === chatId);
    if (!chat) return 'private';
    return chat.visibility;
  }, [history, chatId, localVisibility]);

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    setLocalVisibility(updatedVisibilityType);
    mutate(unstable_serialize(getChatHistoryPaginationKey));

    // TODO: updateChatVisibility should be called here
    // This needs to be provided by the consuming app
    // updateChatVisibility({
    //   chatId: chatId,
    //   visibility: updatedVisibilityType,
    // });
  };

  return { visibilityType, setVisibilityType };
}
