-- Create RLS policies for messages table to enable match messaging functionality
-- Members of a match should be able to view and send messages within their matches

-- Policy: Allow match members to view messages in their matches
CREATE POLICY "Match members can view messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    is_match_member(match_id, auth.uid())
  );

-- Policy: Allow match members to send messages to their matches
CREATE POLICY "Match members can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id 
    AND is_match_member(match_id, auth.uid())
  );

-- Optional: Allow senders to mark their own messages as read
CREATE POLICY "Users can update read status"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    is_match_member(match_id, auth.uid())
  )
  WITH CHECK (
    is_match_member(match_id, auth.uid())
  );