import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import { LayoutComponent } from './shared/components/Layout';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { LoginView } from './modules/auth/LoginView';
import { SignUpView } from './modules/auth/SignUpView';
import { HitListView } from './modules/hits/HitList';
import { HitView } from './modules/hits/Hit';
import { HitmanListView } from './modules/hitman/HitmanList';
import { HitmanView } from './modules/hitman/Hitman';

function App() {
  return (
    <Router>
      <LayoutComponent>
        <Switch>
          <Route path="/hits">
            <ProtectedRoute>
              <HitListView />
            </ProtectedRoute>
          </Route>
          <Route path="/hit/:id">
            <ProtectedRoute>
              <HitView />
            </ProtectedRoute>
          </Route>
          <Route path="/hitmen">
            <ProtectedRoute>
              <HitmanListView />
            </ProtectedRoute>
          </Route>
          <Route path="/hitman/:id">
            <ProtectedRoute>
              <HitmanView />
            </ProtectedRoute>
          </Route>
          <Route path="/register">
            <SignUpView />
          </Route>
          <Route path="/" exact>
            <LoginView />
          </Route>
        </Switch>
      </LayoutComponent>
    </Router>
  );
}

export default App;
