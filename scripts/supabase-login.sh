#!/bin/bash

# Load environment variables from .env.local
export $(cat .env.local | grep -v '^#' | grep SUPABASE_ACCESS_TOKEN | xargs)

# Login to Supabase
supabase login --token "$SUPABASE_ACCESS_TOKEN"

echo "✅ Logged in successfully!"
