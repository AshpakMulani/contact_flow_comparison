class JSONDiff:
    @staticmethod
    def diff(obj1, obj2):
        if obj1 == obj2:
            return None
        
        
        if type(obj1) != type(obj2):
            return {'updated': obj2}
        
        if isinstance(obj1, dict):
            added_keys = set(obj2.keys()) - set(obj1.keys())
            deleted_keys = set(obj1.keys()) - set(obj2.keys())
            common_keys = set(obj1.keys()) & set(obj2.keys())
            delta = {}

            print(added_keys)
            for key in added_keys:
                delta[key] = {'added': obj2[key]}

            for key in deleted_keys:
                delta[key] = {'deleted': True}

            for key in common_keys:
                nested_delta = JSONDiff.diff(obj1[key], obj2[key])
                if nested_delta:
                    delta[key] = nested_delta

            return delta
        
        if isinstance(obj1, list):
            if len(obj1) != len(obj2):
                return {'updated': obj2}
            
            delta = []
            for idx, (item1, item2) in enumerate(zip(obj1, obj2)):
                nested_delta = JSONDiff.diff(item1, item2)
                if nested_delta:
                    delta.append({idx: nested_delta})
            
            return delta

    @staticmethod
    def print_diff(delta, indent=0):
        for key, value in delta.items():
            if isinstance(value, dict):
                print(' ' * indent + f'Key: {key}')
                JSONDiff.print_diff(value, indent + 2)
            else:
                print(' ' * indent + f'{key}: {value}')

# Example usage
json1 = {
    "name": "John",
    "age": 25,
    "address": {
        "city": "New York",
        "country": "USA"
    }
}

json2 = {
    "name": "John Smith",
    "age": 30,
    "address": {
        "city": "San Francisco",
        "country": "USA"
    }
}

delta = JSONDiff.diff(json1, json2)
print(delta)
JSONDiff.print_diff(delta)
