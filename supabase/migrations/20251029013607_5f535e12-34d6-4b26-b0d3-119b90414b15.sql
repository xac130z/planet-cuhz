-- Add RLS policies to messages table for secure match communication

-- Allow match members to view messages in their matches
CREATE POLICY "Match members can view messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
        AND auth.uid() = ANY(matches.member_ids)
    )
  );

-- Allow match members to send messages to their matches
CREATE POLICY "Match members can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
        AND auth.uid() = ANY(matches.member_ids)
    )
  );

-- Allow match members to mark messages as read
CREATE POLICY "Users can mark messages as read"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
        AND auth.uid() = ANY(matches.member_ids)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
        AND auth.uid() = ANY(matches.member_ids)
    )
  );