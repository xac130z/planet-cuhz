export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          availability_opt_in: boolean | null
          last_notified_at: string | null
          phone_opt_in: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability_opt_in?: boolean | null
          last_notified_at?: string | null
          phone_opt_in?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability_opt_in?: boolean | null
          last_notified_at?: string | null
          phone_opt_in?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ban_list: {
        Row: {
          banned_by: string | null
          created_at: string
          expires_at: string | null
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          banned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          banned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          buyer_id: string | null
          completed_games: number | null
          contracted_games: number | null
          created_at: string | null
          id: string
          notes: string | null
          player_id: string | null
          price_usd: number
          status: string | null
          stripe_payment_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          completed_games?: number | null
          contracted_games?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          player_id?: string | null
          price_usd: number
          status?: string | null
          stripe_payment_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          completed_games?: number | null
          contracted_games?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          player_id?: string | null
          price_usd?: number
          status?: string | null
          stripe_payment_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      channels: {
        Row: {
          channel_name: string
          id: number
          is_active: boolean | null
          joined_at: string | null
        }
        Insert: {
          channel_name: string
          id?: number
          is_active?: boolean | null
          joined_at?: string | null
        }
        Update: {
          channel_name?: string
          id?: number
          is_active?: boolean | null
          joined_at?: string | null
        }
        Relationships: []
      }
      character_uploads: {
        Row: {
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          upload_type: string
          uploaded_at: string
          user_profile_id: string | null
        }
        Insert: {
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          upload_type: string
          uploaded_at?: string
          user_profile_id?: string | null
        }
        Update: {
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          upload_type?: string
          uploaded_at?: string
          user_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_uploads_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comms_logs: {
        Row: {
          channel: string
          created_at: string | null
          error: string | null
          event_type: string
          id: string
          metadata: Json | null
          provider: string | null
          status: string
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string | null
          error?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          provider?: string | null
          status?: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string | null
          error?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          provider?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      content_flags: {
        Row: {
          created_at: string
          details: string | null
          id: string
          listing_id: string | null
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          listing_id?: string | null
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          listing_id?: string | null
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_flags_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "lfg_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      cuhz_characters: {
        Row: {
          character_theme: string
          created_at: string
          generation_prompt: string | null
          id: string
          image_url: string
          is_godly_form: boolean
          user_profile_id: string | null
        }
        Insert: {
          character_theme: string
          created_at?: string
          generation_prompt?: string | null
          id?: string
          image_url: string
          is_godly_form?: boolean
          user_profile_id?: string | null
        }
        Update: {
          character_theme?: string
          created_at?: string
          generation_prompt?: string | null
          id?: string
          image_url?: string
          is_godly_form?: boolean
          user_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuhz_characters_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          founders_expires_at: string | null
          hire_credit_cap_usd: number | null
          hire_credit_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          founders_expires_at?: string | null
          hire_credit_cap_usd?: number | null
          hire_credit_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          founders_expires_at?: string | null
          hire_credit_cap_usd?: number | null
          hire_credit_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      game_logs: {
        Row: {
          bonus_command_earned: boolean
          created_at: string
          duration_seconds: number | null
          game_type: string
          id: string
          play_date: string
          score: number
          user_profile_id: string
          won: boolean
        }
        Insert: {
          bonus_command_earned?: boolean
          created_at?: string
          duration_seconds?: number | null
          game_type?: string
          id?: string
          play_date?: string
          score?: number
          user_profile_id: string
          won?: boolean
        }
        Update: {
          bonus_command_earned?: boolean
          created_at?: string
          duration_seconds?: number | null
          game_type?: string
          id?: string
          play_date?: string
          score?: number
          user_profile_id?: string
          won?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "game_logs_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lfg_applications: {
        Row: {
          applicant_id: string
          created_at: string
          id: string
          listing_id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          created_at?: string
          id?: string
          listing_id: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lfg_applications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "lfg_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      lfg_listings: {
        Row: {
          allows_crossplay: boolean
          availability: string | null
          boost_expires_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          modes: string[]
          needed_positions: string[]
          notes: string | null
          platform: string | null
          region: string | null
          role: string
          skill_tier: string | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          allows_crossplay?: boolean
          availability?: string | null
          boost_expires_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          modes?: string[]
          needed_positions?: string[]
          notes?: string | null
          platform?: string | null
          region?: string | null
          role: string
          skill_tier?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Update: {
          allows_crossplay?: boolean
          availability?: string | null
          boost_expires_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          modes?: string[]
          needed_positions?: string[]
          notes?: string | null
          platform?: string | null
          region?: string | null
          role?: string
          skill_tier?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      match_responses: {
        Row: {
          action: string
          created_at: string
          id: string
          match_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          match_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          match_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_responses_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          explanation: string
          id: string
          member_ids: string[]
          position_coverage: Json
          scheduled_overlap_minutes: number
          score: number
          status: Database["public"]["Enums"]["match_status"]
          type: Database["public"]["Enums"]["match_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          explanation?: string
          id?: string
          member_ids: string[]
          position_coverage?: Json
          scheduled_overlap_minutes?: number
          score?: number
          status?: Database["public"]["Enums"]["match_status"]
          type: Database["public"]["Enums"]["match_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          explanation?: string
          id?: string
          member_ids?: string[]
          position_coverage?: Json
          scheduled_overlap_minutes?: number
          score?: number
          status?: Database["public"]["Enums"]["match_status"]
          type?: Database["public"]["Enums"]["match_type"]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          match_id: string
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          match_id: string
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          match_id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          attempts: number | null
          channel: string
          created_at: string
          error: string | null
          id: string
          last_attempt_at: string | null
          match_id: string
          payload: Json
          status: string
        }
        Insert: {
          attempts?: number | null
          channel: string
          created_at?: string
          error?: string | null
          id?: string
          last_attempt_at?: string | null
          match_id: string
          payload?: Json
          status?: string
        }
        Update: {
          attempts?: number | null
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          last_attempt_at?: string | null
          match_id?: string
          payload?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      payments_audit: {
        Row: {
          event_id: string
          event_type: string
          payload: Json | null
          price_id: string | null
          processed_at: string | null
          user_id: string | null
        }
        Insert: {
          event_id: string
          event_type: string
          payload?: Json | null
          price_id?: string | null
          processed_at?: string | null
          user_id?: string | null
        }
        Update: {
          event_id?: string
          event_type?: string
          payload?: Json | null
          price_id?: string | null
          processed_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      protocol_profiles: {
        Row: {
          allow_contact: boolean
          archetype_primary: string | null
          archetype_secondary: string | null
          availability: Json | null
          badges: Json | null
          bio: string | null
          competitive_level: string | null
          consent_comms: boolean | null
          created_at: string | null
          discord: string | null
          display_name: string
          email: string | null
          experience_years: number | null
          hand: string | null
          height_in: number | null
          id: string
          languages: string[] | null
          mic: boolean | null
          modes: string[]
          overall_rating: number | null
          phone: string | null
          platform: string
          playstyle: string[] | null
          preferred_contact: string | null
          psn: string | null
          published: boolean | null
          region: string | null
          role: string
          timezone: string
          twitch_id: string | null
          twitch_login: string | null
          twitch_url: string | null
          twitter: string | null
          updated_at: string | null
          verified: boolean | null
          weight_lb: number | null
          win_percentage: number | null
          xbox: string | null
        }
        Insert: {
          allow_contact?: boolean
          archetype_primary?: string | null
          archetype_secondary?: string | null
          availability?: Json | null
          badges?: Json | null
          bio?: string | null
          competitive_level?: string | null
          consent_comms?: boolean | null
          created_at?: string | null
          discord?: string | null
          display_name: string
          email?: string | null
          experience_years?: number | null
          hand?: string | null
          height_in?: number | null
          id: string
          languages?: string[] | null
          mic?: boolean | null
          modes?: string[]
          overall_rating?: number | null
          phone?: string | null
          platform: string
          playstyle?: string[] | null
          preferred_contact?: string | null
          psn?: string | null
          published?: boolean | null
          region?: string | null
          role: string
          timezone?: string
          twitch_id?: string | null
          twitch_login?: string | null
          twitch_url?: string | null
          twitter?: string | null
          updated_at?: string | null
          verified?: boolean | null
          weight_lb?: number | null
          win_percentage?: number | null
          xbox?: string | null
        }
        Update: {
          allow_contact?: boolean
          archetype_primary?: string | null
          archetype_secondary?: string | null
          availability?: Json | null
          badges?: Json | null
          bio?: string | null
          competitive_level?: string | null
          consent_comms?: boolean | null
          created_at?: string | null
          discord?: string | null
          display_name?: string
          email?: string | null
          experience_years?: number | null
          hand?: string | null
          height_in?: number | null
          id?: string
          languages?: string[] | null
          mic?: boolean | null
          modes?: string[]
          overall_rating?: number | null
          phone?: string | null
          platform?: string
          playstyle?: string[] | null
          preferred_contact?: string | null
          psn?: string | null
          published?: boolean | null
          region?: string | null
          role?: string
          timezone?: string
          twitch_id?: string | null
          twitch_login?: string | null
          twitch_url?: string | null
          twitter?: string | null
          updated_at?: string | null
          verified?: boolean | null
          weight_lb?: number | null
          win_percentage?: number | null
          xbox?: string | null
        }
        Relationships: []
      }
      rate_limit_tracking: {
        Row: {
          action_type: string
          created_at: string
          id: string
          identifier: string
          request_count: number
          updated_at: string
          window_start: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          identifier: string
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          identifier?: string
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string
          created_at: string
          error_message: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          success: boolean
          user_agent: string | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          action: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      swipes: {
        Row: {
          action: string
          created_at: string
          id: string
          swiped_id: string
          swiper_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          swiped_id: string
          swiper_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          swiped_id?: string
          swiper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipes_swiped_id_fkey"
            columns: ["swiped_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_swiper_id_fkey"
            columns: ["swiper_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_build_players: {
        Row: {
          accepted: boolean | null
          created_at: string | null
          fee: number | null
          id: string
          player_id: string | null
          role: string
          team_build_id: string | null
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string | null
          fee?: number | null
          id?: string
          player_id?: string | null
          role: string
          team_build_id?: string | null
        }
        Update: {
          accepted?: boolean | null
          created_at?: string | null
          fee?: number | null
          id?: string
          player_id?: string | null
          role?: string
          team_build_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_build_players_team_build_id_fkey"
            columns: ["team_build_id"]
            isOneToOne: false
            referencedRelation: "team_builds"
            referencedColumns: ["id"]
          },
        ]
      }
      team_builds: {
        Row: {
          availability_windows: string | null
          budget_notes: string | null
          buyer_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          desired_roles: Json | null
          discord_psn: string | null
          id: string
          platform: string | null
          region: string | null
          skill_tiers: string[] | null
          status: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          availability_windows?: string | null
          budget_notes?: string | null
          buyer_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          desired_roles?: Json | null
          discord_psn?: string | null
          id?: string
          platform?: string | null
          region?: string | null
          skill_tiers?: string[] | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          availability_windows?: string | null
          budget_notes?: string | null
          buyer_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          desired_roles?: Json | null
          discord_psn?: string | null
          id?: string
          platform?: string | null
          region?: string | null
          skill_tiers?: string[] | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          reason: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          reason: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          reason?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      twitch_tokens: {
        Row: {
          access_token: string
          display_name: string
          expires_in: number
          login: string
          obtained_at: string
          refresh_token: string
          scope: string[]
          twitch_user_id: string
        }
        Insert: {
          access_token: string
          display_name: string
          expires_in: number
          login: string
          obtained_at?: string
          refresh_token: string
          scope: string[]
          twitch_user_id: string
        }
        Update: {
          access_token?: string
          display_name?: string
          expires_in?: number
          login?: string
          obtained_at?: string
          refresh_token?: string
          scope?: string[]
          twitch_user_id?: string
        }
        Relationships: []
      }
      twitch_users: {
        Row: {
          access_token: string
          created_at: string
          display_name: string
          email: string | null
          expires_at: string
          id: number
          login: string
          profile_image_url: string | null
          refresh_token: string
          twitch_id: string
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          display_name: string
          email?: string | null
          expires_at: string
          id?: never
          login: string
          profile_image_url?: string | null
          refresh_token: string
          twitch_id: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          display_name?: string
          email?: string | null
          expires_at?: string
          id?: never
          login?: string
          profile_image_url?: string | null
          refresh_token?: string
          twitch_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age: number | null
          astrology_level: string | null
          birth_date: string | null
          birth_location: string | null
          birth_name: string | null
          birth_time: string | null
          character_prompt: string | null
          consent_comms: boolean | null
          created_at: string
          digest_cadence: string | null
          display_name: string | null
          email: string | null
          energy_word: string | null
          handles: Json | null
          id: string
          interests: string[] | null
          keywords: string[] | null
          location: string | null
          meditation_styles: string[] | null
          onboarding_completed: boolean | null
          onboarding_status: string | null
          onboarding_step: number | null
          phone: string | null
          preferred_contact: string | null
          profile: Json | null
          profile_photo_url: string | null
          pronouns: string | null
          spiritual_practices: string[] | null
          stripe_customer_id: string | null
          timezone: string | null
          twitch_name: string | null
          twitter_handle: string | null
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          age?: number | null
          astrology_level?: string | null
          birth_date?: string | null
          birth_location?: string | null
          birth_name?: string | null
          birth_time?: string | null
          character_prompt?: string | null
          consent_comms?: boolean | null
          created_at?: string
          digest_cadence?: string | null
          display_name?: string | null
          email?: string | null
          energy_word?: string | null
          handles?: Json | null
          id?: string
          interests?: string[] | null
          keywords?: string[] | null
          location?: string | null
          meditation_styles?: string[] | null
          onboarding_completed?: boolean | null
          onboarding_status?: string | null
          onboarding_step?: number | null
          phone?: string | null
          preferred_contact?: string | null
          profile?: Json | null
          profile_photo_url?: string | null
          pronouns?: string | null
          spiritual_practices?: string[] | null
          stripe_customer_id?: string | null
          timezone?: string | null
          twitch_name?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
          user_type?: string | null
        }
        Update: {
          age?: number | null
          astrology_level?: string | null
          birth_date?: string | null
          birth_location?: string | null
          birth_name?: string | null
          birth_time?: string | null
          character_prompt?: string | null
          consent_comms?: boolean | null
          created_at?: string
          digest_cadence?: string | null
          display_name?: string | null
          email?: string | null
          energy_word?: string | null
          handles?: Json | null
          id?: string
          interests?: string[] | null
          keywords?: string[] | null
          location?: string | null
          meditation_styles?: string[] | null
          onboarding_completed?: boolean | null
          onboarding_status?: string | null
          onboarding_step?: number | null
          phone?: string | null
          preferred_contact?: string | null
          profile?: Json | null
          profile_photo_url?: string | null
          pronouns?: string | null
          spiritual_practices?: string[] | null
          stripe_customer_id?: string | null
          timezone?: string | null
          twitch_name?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      user_social_verification: {
        Row: {
          created_at: string
          id: string
          twitter_handle: string
          updated_at: string
          user_profile_id: string | null
          verification_proof_url: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string
          id?: string
          twitter_handle: string
          updated_at?: string
          user_profile_id?: string | null
          verification_proof_url?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string
          id?: string
          twitter_handle?: string
          updated_at?: string
          user_profile_id?: string | null
          verification_proof_url?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_social_verification_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      protocol_public_profiles: {
        Row: {
          archetype_primary: string | null
          archetype_secondary: string | null
          availability: Json | null
          bio: string | null
          competitive_level: string | null
          created_at: string | null
          discord: string | null
          display_name: string | null
          hand: string | null
          height_in: number | null
          id: string | null
          languages: string[] | null
          mic: boolean | null
          modes: string[] | null
          overall_rating: number | null
          platform: string | null
          playstyle: string[] | null
          psn: string | null
          region: string | null
          role: string | null
          timezone: string | null
          twitch_login: string | null
          twitch_url: string | null
          twitter: string | null
          verified: boolean | null
          weight_lb: number | null
          win_percentage: number | null
          xbox: string | null
        }
        Insert: {
          archetype_primary?: string | null
          archetype_secondary?: string | null
          availability?: Json | null
          bio?: string | null
          competitive_level?: string | null
          created_at?: string | null
          discord?: string | null
          display_name?: string | null
          hand?: string | null
          height_in?: number | null
          id?: string | null
          languages?: string[] | null
          mic?: boolean | null
          modes?: string[] | null
          overall_rating?: number | null
          platform?: string | null
          playstyle?: string[] | null
          psn?: string | null
          region?: string | null
          role?: string | null
          timezone?: string | null
          twitch_login?: string | null
          twitch_url?: string | null
          twitter?: string | null
          verified?: boolean | null
          weight_lb?: number | null
          win_percentage?: number | null
          xbox?: string | null
        }
        Update: {
          archetype_primary?: string | null
          archetype_secondary?: string | null
          availability?: Json | null
          bio?: string | null
          competitive_level?: string | null
          created_at?: string | null
          discord?: string | null
          display_name?: string | null
          hand?: string | null
          height_in?: number | null
          id?: string | null
          languages?: string[] | null
          mic?: boolean | null
          modes?: string[] | null
          overall_rating?: number | null
          platform?: string | null
          playstyle?: string[] | null
          psn?: string | null
          region?: string | null
          role?: string | null
          timezone?: string | null
          twitch_login?: string | null
          twitch_url?: string | null
          twitter?: string | null
          verified?: boolean | null
          weight_lb?: number | null
          win_percentage?: number | null
          xbox?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_action_type: string
          p_identifier: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_banned: { Args: { p_user: string }; Returns: boolean }
      is_match_member: {
        Args: { _match_id: string; _user_id: string }
        Returns: boolean
      }
      is_user_banned: { Args: { _user_id: string }; Returns: boolean }
      log_security_event:
        | {
            Args: {
              p_action: string
              p_error_message?: string
              p_metadata?: Json
              p_resource_id?: string
              p_resource_type: string
              p_success?: boolean
              p_wallet_address?: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_action: string
              p_error_message?: string
              p_ip_address?: unknown
              p_metadata?: Json
              p_resource_id?: string
              p_resource_type: string
              p_success?: boolean
              p_user_agent?: string
              p_wallet_address?: string
            }
            Returns: undefined
          }
    }
    Enums: {
      app_role: "admin" | "root"
      match_status: "new" | "pending_accept" | "mutual_accept" | "declined"
      match_type: "nba2k_pair" | "nba2k_squad5"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "root"],
      match_status: ["new", "pending_accept", "mutual_accept", "declined"],
      match_type: ["nba2k_pair", "nba2k_squad5"],
    },
  },
} as const
