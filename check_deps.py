try:
    import streamlit
    print("✅ streamlit imported")
    import supabase
    print("✅ supabase imported")
    import google.generativeai
    print("✅ google.generativeai imported")
    import dotenv
    print("✅ python-dotenv imported")
    import dateutil
    print("✅ python-dateutil imported")
    print("ALL DEPENDENCIES OK")
except ImportError as e:
    print(f"❌ MISSING DEPENDENCY: {e}")
except Exception as e:
    print(f"❌ ERROR: {e}")
